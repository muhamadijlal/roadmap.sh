import path from "path";
import fs from "fs/promises";

function errorMessage(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

async function main() {
  const jsonFilepath = process.argv.at(2);

  if (!jsonFilepath) {
    errorMessage("please provide a JSON file path");
    return;
  }

  try {
    const rawData = await fs.readFile(jsonFilepath, { encoding: "utf8" });
    const jsonValid = JSON.parse(rawData);

    console.log(JSON.stringify(jsonValid, null, 2));
  } catch (error) {
    if (error.code === "ENOENT") {
      errorMessage(`could not read file: ${path.basename(jsonFilepath)}`);
    } else if (error instanceof SyntaxError) {
      errorMessage(`invalid JSON in file: ${path.basename(jsonFilepath)}`);
    } else {
      errorMessage(error);
    }
  }
}

main();
