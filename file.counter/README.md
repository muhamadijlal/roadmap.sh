# file.counter

A simple Node.js CLI that reads a text file and prints its name, the number of lines, words, and characters.

Project URL: https://roadmap.sh/projects/nodejs-file-counter

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 18 or newer (ES modules are used)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/file.counter
```

No dependencies to install.

## Usage

```bash
node file-counter.js <path-to-file>
```

Example using the included `notes.txt`:

```bash
node file-counter.js notes.txt
```

### Example output

```
    File: notes.txt
    Lines: 2
    Words: 9
    Characters: 52
```

### Errors

If no file path is given, or the file cannot be read, the program prints an error message to stderr and exits with code `1`:

```
error: please provide a file path
error: could not read file: nope.txt
```

## How it works

1. Reads the file path from the first CLI argument.
2. Reads the file as UTF-8 with `fs/promises`.
3. Counts non-empty lines, words (letters and digits sequences), and characters (Unicode-aware, ignoring trailing whitespace).

## License

ISC
