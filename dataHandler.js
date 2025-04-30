import { writeFileSync, readFileSync, existsSync } from "fs";
import path from "path";

// Correct path calculation for ES modules
const filePath = path.join(process.cwd(), "data.json");

export const initializeDataFile = () => {
  if (!existsSync(filePath)) {
    const initialData = {
      movies: [],
      series: [],
      songs: [],
    };
    writeFileSync(filePath, JSON.stringify(initialData, null, 2)); // create the file with empty data
  }
};

export const readData = () => {
  if (existsSync(filePath)) {
    const rawData = readFileSync(filePath);
    return JSON.parse(rawData);
  }
  return null;
};

export const writeData = (data) => {
  writeFileSync(filePath, JSON.stringify(data, null, 2)); // overwrite file with new data
};

