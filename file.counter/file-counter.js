import path from "path";
import fs from "fs/promises";

// get the argument pathfile
const pathfile = process.argv.at(2);

// return error log
function printError() {
  console.error("error: please provide a file path");
  process.exit = 1;
}

// process the text
function getTextStats(text) {
  return {
    lines: text.split("\n").filter(Boolean).length,
    words: text.split("/\s+/").flatMap((s) => s.match(/[\p{L}\p{N}]+/gu) ?? [])
      .length,
    characters: [...text.replace(/\r\n/g, "\n").trimEnd()].length,
  };
}

// main function
async function main() {
  try {
    // validate if missing pathfile
    if (!pathfile) {
      printError();
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
