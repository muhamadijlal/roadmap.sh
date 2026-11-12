# expense.tracker

A simple Node.js CLI to track your expenses. Add expenses, list them, delete them, and view a summary (total of all expenses or for a specific month). Expenses are stored in a local JSON file (`expense-tracker.json`), which is created automatically on the first `add`.

Project URL: https://roadmap.sh/projects/expense-tracker

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 20.12 or newer (uses `util.styleText` and JSON import attributes)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/expense.tracker
npm install
```

Optional: expose the `expense-tracker` command globally.

```bash
npm link
```

## Usage

```bash
node main.js <command> [options]
# or, after `npm link`
expense-tracker <command> [options]
```

| Command | Description |
| --- | --- |
| `add -d <text> -a <number>` | Add a new expense (`description` must not be empty, `amount` must be an integer greater than 0) |
| `list` | List all expenses |
| `summary [--month <number>]` | Show the total of all expenses, or only for a month (1-12) of the current year |
| `delete --id <number>` | Delete an expense by its ID |
| `help [command]` | Show usage information |

Global options: `-v, --version` and `-h, --help`.

### Examples

```bash
node main.js add -d "Makan siang" -a 25000
# Expense added successfully (ID: 1)

node main.js list
# ID  Date        Description  Amount
# 1   2026-11-12  Makan siang  Rp 25.000

node main.js summary
# Total expenses: Rp 25.000

node main.js summary --month 11
# Total expenses for November: Rp 25.000

node main.js delete --id 1
# expense id: 1 has been deleted!
```

Invalid input prints an error to stderr and exits with a non-zero code:

```bash
node main.js add -d "Kopi" -a abc
# error: amount must be an integer greater than 0

node main.js delete --id 99
# error: expense id: 99 not found!
```

## Data

Each expense is stored in `expense-tracker.json` (next to `main.js`) with this shape:

```json
{
  "id": 1,
  "description": "Makan siang",
  "amount": 25000,
  "createdAt": "2026-11-12T02:41:22.493Z",
  "updatedAt": null
}
```

Amounts are displayed in Rupiah (`id-ID` format). The data file is git-ignored.
