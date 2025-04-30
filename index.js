import http from "http";
import { parse } from "querystring";
import fs from "fs";
import path from "path";
import { initializeDataFile, readData, writeData } from "./dataHandler.js";
import { fileURLToPath } from "url"; // Import for converting URL to path
import { dirname } from "path"; // Import for getting the directory name

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize data file if it doesn't exist
initializeDataFile();

// Function to send JSON data
const sendData = (res, data, statusCode = 200) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
};

// Function to handle errors
const handleError = (res, message, statusCode = 500) => {
  res.statusCode = statusCode;
  res.end(JSON.stringify({ error: message }));
};

// Function to handle POST requests
const handlePostRequest = (req, res, category) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const newData = JSON.parse(body);
      newData.id = category.length + 1;
      category.push(newData);
      try {
        writeData(readData()); // Save the updated data to the file
      } catch (writeErr) {
        return handleError(res, "Failed to write data", 500);
      }
      sendData(res, category);
    } catch (err) {
      handleError(res, "Invalid JSON format in request body", 400);
    }
  });
};

// Function to handle DELETE requests
const handleDeleteRequest = (req, res, category) => {
  const url = req.url.split("/");
  const id = parseInt(url[url.length - 1], 10);

  const index = category.findIndex((item) => item.id === id);
  if (index !== -1) {
    category.splice(index, 1);
    try {
      writeData(readData()); // Save the updated data to the file
    } catch (writeErr) {
      return handleError(res, "Failed to write data", 500);
    }
    sendData(res, category);
  } else {
    handleError(res, "Item not found", 404);
  }
};

// Function to handle PUT requests
const handlePutRequest = (req, res, category) => {
  const url = req.url.split("/");
  const id = parseInt(url[url.length - 1], 10);

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const updatedData = JSON.parse(body);
      const index = category.findIndex((item) => item.id === id);
      if (index !== -1) {
        category[index] = { ...category[index], ...updatedData };
        try {
          writeData(readData()); // Save the updated data to the file
        } catch (writeErr) {
          return handleError(res, "Failed to write data", 500);
        }
        sendData(res, category);
      } else {
        handleError(res, "Item not found", 404);
      }
    } catch (err) {
      handleError(res, "Invalid JSON format in request body", 400);
    }
  });
};

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Serve the API documentation (index.html)
  if (url === "/" && method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        return handleError(res, "Error loading index.html", 500);
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(content);
      }
    });
    return;
  }

  // Handle GET requests for /movies, /series, and /songs
  let data;
  try {
    data = readData(); // Read the current data from the file
  } catch (err) {
    return handleError(res, "Failed to read data", 500);
  }

  if (url === "/movies" && method === "GET") {
    sendData(res, data.movies);
    return;
  }

  if (url === "/series" && method === "GET") {
    sendData(res, data.series);
    return;
  }

  if (url === "/songs" && method === "GET") {
    sendData(res, data.songs);
    return;
  }

  // Handle POST requests for /movies, /series, and /songs
  if (
    (url === "/movies" || url === "/series" || url === "/songs") &&
    method === "POST"
  ) {
    const category =
      url === "/movies"
        ? data.movies
        : url === "/series"
        ? data.series
        : data.songs;
    handlePostRequest(req, res, category);
    return;
  }

  // Handle DELETE requests for /movies/:id, /series/:id, and /songs/:id
  if (
    (url.startsWith("/movies/") ||
      url.startsWith("/series/") ||
      url.startsWith("/songs/")) &&
    method === "DELETE"
  ) {
    const category = url.startsWith("/movies/")
      ? data.movies
      : url.startsWith("/series/")
      ? data.series
      : data.songs;
    handleDeleteRequest(req, res, category);
    return;
  }

  // Handle PUT requests for /movies/:id, /series/:id, and /songs/:id
  if (
    (url.startsWith("/movies/") ||
      url.startsWith("/series/") ||
      url.startsWith("/songs/")) &&
    method === "PUT"
  ) {
    const category = url.startsWith("/movies/")
      ? data.movies
      : url.startsWith("/series/")
      ? data.series
      : data.songs;
    handlePutRequest(req, res, category);
    return;
  }

  // Handle 404 for unknown paths
  handleError(res, "Not Found", 404);
});

let data;
try {
  data = readData(); // Read the current data
} catch (err) {
  console.error("Error reading data:", err);
  process.exit(1); // Exit if reading data fails
}

// Add a test movie if the movies array is empty
if (data.movies.length === 0) {
  data.movies.push({ id: 1, title: "Test Movie" });
  try {
    writeData(data); // Save it back to the file
  } catch (err) {
    console.error("Error writing data:", err);
    process.exit(1); // Exit if writing data fails
  }
}

// Start the server
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
