import http from "http";

let movies = [
  { id: 1, title: "Tsotsi", director: "Gavin Hood", year: 2005 },
  { id: 2, title: "District 9", director: "Neill Blomkamp", year: 2009 },
  { id: 3, title: "Sarafina!", director: "Darrell Roodt", year: 1992 },
  { id: 4, title: "Yesterday", director: "Darrell Roodt", year: 2004 },
  { id: 5, title: "Five Fingers for Marseilles", director: "Michael Matthews", year: 2017},
];

let series = [
  { id: 1, title: "Breaking Bad", creator: "Gilligan", year: 2008 },
  { id: 2, title: "Stranger Things", creator: "Duffer", year: 2016 },
  { id: 3, title: "Blood & Water", creator: "Tracy A. Armstrong", year: 2020 },
  { id: 4, title: "The River", creator: "Bongi Ndaba", year: 2018 },
];

let songs = [
  { id: 6, title: "Levitating", artist: "Dua Lipa ft. DaBaby", year: 2020 },
  { id: 7, title: "Save Your Tears", artist: "The Weeknd & Ariana Grande", year: 2021,},
  { id: 2, title: "AKA", artist: "All Eyes On Me", year: 2016 },
  { id: 3, title: "Shosholoza", artist: "Chaka Chaka", year: 1987 },
  { id: 4, title: "Loliwe", artist: "Zahara", year: 2011 },
];

const sendData = (res, data) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data)); 
};

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;


  if (url === "/" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Welcome to the Node.js. Try /movies, /series, or /songs.");
  }

  if (url === "/movies" && method === "GET") {
    sendData(res, movies); 
  }
  
  else if (url === "/series" && method === "GET") {
    sendData(res, series);
  }
  
  else if (url === "/songs" && method === "GET") {
    sendData(res, songs); 
  }
  
  else {
    res.statusCode = 404; 
    res.end("Not Found");
  }
});


server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});