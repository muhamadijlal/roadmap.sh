# json.formatter

A simple Node.js CLI that reads a JSON file, validates it, and prints it pretty-formatted (2-space indentation) to the terminal.

Project URL: https://roadmap.sh/projects/nodejs-json-formatter

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 14.8 or newer (ES modules and top-level `fs/promises`); Node.js 16.6 or newer is required for `Array.prototype.at`

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/json.formatter
```

No dependencies to install.

## Usage

```bash
node json-formatter.js <path-to-json-file>
```

Example using the included `user.json`:

```bash
node json-formatter.js user.json
```

### Example output

Input (`user.json`):

```json
{ "name": "Ava", "role": "Developer", "skills": ["JavaScript", "Node.js"] }
```

Output:

```json
{
  "name": "Ava",
  "role": "Developer",
  "skills": [
    "JavaScript",
    "Node.js"
  ]
}
```

### Errors

Errors are printed to stderr and the program exits with code `1`:

```
error: please provide a JSON file path
error: could not read file: <file-name>
error: invalid JSON in file: <file-name>
```

You can try the invalid JSON case with the included `broken.json`:

```bash
node json-formatter.js broken.json
```

## How it works

1. Reads the file path from the first CLI argument (`process.argv`).
2. Reads the file content using `fs/promises`.
3. Parses it with `JSON.parse` to validate it.
4. Prints the result using `JSON.stringify(value, null, 2)`, or an error message if reading or parsing fails.

## License

ISC
