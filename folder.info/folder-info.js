import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const argspath = process.argv.at(2);

const pathtarget = argspath ? path.resolve(argspath) : root;

try {
  const entries = await fs.readdir(pathtarget, { withFileTypes: true });

  const fileCount = entries.filter((entry) => entry.isFile()).length;
  const folderCount = entries.filter((entry) => entry.isDirectory()).length;

  console.log(`
    Folder: ${path.dirname(pathtarget)}
    Path: ${pathtarget}
    Files: ${fileCount}
    Folders: ${folderCount}
`);
} catch (e) {
  console.error("error: could not read folder: missing-folder");
  process.exitCode = 1;
}
