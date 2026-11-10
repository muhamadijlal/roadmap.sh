# task.tracker

A simple Node.js CLI to track your tasks. Add, update, and delete tasks, mark them as in progress or done, and list them by status. Tasks are stored in a local JSON file (`task.json`), which is created automatically on first use.

Project URL: https://roadmap.sh/projects/task-tracker

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 14 or newer

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/task.tracker
```

No dependencies to install.

Optional: expose the `task-cli` command globally.

```bash
npm link
```

## Usage

```bash
node main.js <command> [arguments]
# or, after `npm link`
task-cli <command> [arguments]
```

| Command | Description |
| --- | --- |
| `add <description>` | Add a new task (status starts as `todo`) |
| `update <id> <description>` | Change a task's description |
| `delete <id>` | Delete a task |
| `mark-in-progress <id>` | Mark a task as `in-progress` |
| `mark-done <id>` | Mark a task as `done` |
| `list [status]` | List all tasks, or only those with the given status (`todo`, `in-progress`, `done`) |
| `help` | Show usage information |

### Examples

```bash
node main.js add "Buy groceries"
# Task added successfully (ID: 1)

node main.js update 1 "Buy groceries and cook dinner"
# Task 1 updated successfully.

node main.js mark-in-progress 1
# Task 1 marked as in-progress.

node main.js list
# [ { id: 1, description: 'Buy groceries and cook dinner', status: 'in-progress' } ]

node main.js list done
# info: There are no tasks marked as 'done' yet

node main.js delete 1
# Task 1 deleted successfully.
```

## Data format

Tasks are saved in `task.json` next to `main.js`:

```json
[
  {
    "id": 1,
    "description": "Buy groceries",
    "status": "todo",
    "createdAt": "2026-11-10T13:59:25.182Z",
    "updatedAt": null
  }
]
```

`updatedAt` is `null` until the task is changed.

## Errors

The CLI prints `error: <message>` to stderr and exits with code `1` when:

- a required argument (ID or description) is missing,
- the ID is not a whole number or no task with that ID exists,
- the status passed to `list` is not one of `todo`, `in-progress`, `done`,
- the command is unknown (usage help is shown too),
- `task.json` contains invalid JSON.
