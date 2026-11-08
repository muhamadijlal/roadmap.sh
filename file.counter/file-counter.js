import path from "path";
import fs from "fs/promises";

// get the argument pathfile
const pathfile = process.argv.at(2);

// return error log
function printError(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

// process the text
function getTextStats(text) {
  return {
    lines: text.split("\n").filter(Boolean).length,
    words: text.trim().split(/\s+/).filter(Boolean).length,
    characters: [...text.replace(/\r\n/g, "\n").trimEnd()].length,
  };
}

// main function
async function main() {
  try {
    // validate if missing pathfile
    if (!pathfile) {
      printError("please provide a file path");
      return;
    }

    // read the file
    const result = await fs.readFile(pathfile, { encoding: "utf8" });
    const { lines, words, characters } = getTextStats(result);

    console.log(`
    File: ${path.basename(pathfile)}
    Lines: ${lines}
    Words: ${words}
    Characters: ${characters}`);
  } catch {
    printError(`could not read file: ${pathfile}`);
  }
}

// run the main function
main();
