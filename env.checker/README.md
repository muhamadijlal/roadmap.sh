# env.checker

A simple Node.js CLI that checks whether the environment variables you name are set. It prints a success message when all of them are set, or lists the missing ones and exits with an error.

Project URL: https://roadmap.sh/projects/nodejs-env-checker

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 14 or newer

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/env.checker
```

No dependencies to install.

## Usage

```bash
node env-checker.js <VAR_NAME> [VAR_NAME...]
```

Example (bash):

```bash
PORT=3000 API_KEY=secret node env-checker.js PORT API_KEY
```

Example (PowerShell):

```powershell
$env:PORT = "3000"; $env:API_KEY = "secret"; node env-checker.js PORT API_KEY
```

### Example output

All variables set (exit code `0`):

```
Set: PORT, API_KEY
All required environment variables are set.
```

Some variables missing (exit code `1`, printed to stderr):

```
error: missing environment variables: API_KEY, DB_URL
```

A variable that is set to an empty string is treated as missing.

### Errors

Errors are printed to stderr and the program exits with code `1`:

```
error: please provide at least one environment variable name.
error: missing environment variables: <names>
```

## How it works

1. Reads the variable names from the CLI arguments (`process.argv`).
2. Filters the names that are not set (or empty) in `process.env`.
3. Prints the list of missing variables as an error, or a success message when none are missing.

## License

ISC
