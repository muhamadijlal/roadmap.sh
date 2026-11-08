# folder.info

A simple Node.js CLI that shows information about a folder: its path, the number of files, and the number of sub-folders.

Project URL: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 18 or newer (ES modules are used)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/folder.info
```

No dependencies to install.

## Usage

```bash
# Inspect the current directory
node folder-info.js

# Inspect a specific folder (relative or absolute path)
node folder-info.js ./src
node folder-info.js "C:\Users\me\Documents"
```

### Example output

```
    Folder: D:\nodejs\projects\roadmap.sh
    Path: D:\nodejs\projects\roadmap.sh\folder.info
    Files: 3
    Folders: 0
```

### Errors

If the folder cannot be read (for example it does not exist), the program prints an error message and exits with code `1`:

```
error: could not read folder: missing-folder
```

## How it works

1. Reads the target path from the first CLI argument (defaults to the current working directory).
2. Lists its entries with `fs.readdir(..., { withFileTypes: true })`.
3. Counts entries that are files and entries that are directories (not recursive).

## License

ISC
