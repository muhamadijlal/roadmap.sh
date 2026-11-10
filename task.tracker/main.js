#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// define global variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filepath = path.join(__dirname, "./task.json");
const VALID_STATUSES = ["todo", "in-progress", "done"];

function printError(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

function printInfo(message) {
  console.log(`info: ${message}`);
}

function showHelp() {
  console.log(`
Usage: task-cli <command> [arguments]

Commands:
  add <description>             Tambah task baru
  update <id> <description>     Ubah deskripsi task
  delete <id>                   Hapus task
  mark-in-progress <id>         Tandai task sedang dikerjakan
  mark-done <id>                Tandai task selesai
  list [status]                 Tampilkan task (status: todo | in-progress | done)
  help                          Tampilkan bantuan ini

Contoh:
  task-cli add "Buy groceries"
  task-cli update 1 "Buy groceries and cook dinner"
  task-cli list done
`);
}

// validate ID, returns number or null (error already printed)
function parseId(taskId, usage) {
  if (!taskId) {
    printError(`Task ID is required. Usage: ${usage}`);
    return null;
  }

  if (!/^\d+$/.test(taskId)) {
    printError(`Invalid task ID "${taskId}". Task ID must be a whole number.`);
    return null;
  }

  return Number(taskId);
}

async function taskApp() {
  const [command, ...args] = process.argv.slice(2);

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "-h"
  ) {
    showHelp();
    return;
  }

  try {
    // create file if doesn't exist
    if (!(await checkFile())) {
      await fs.writeFile(filepath, JSON.stringify([], null, 2));
      console.log("File task.json created");
    }

    await runService(command, args);
  } catch (e) {
    printError(e.message ?? e);
  }
}

async function checkFile() {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function runService(command, arg) {
  switch (command) {
    case "list":
      await getAllTask(arg[0]);
      break;
    case "add":
      await createTask(arg.join(" ").trim());
      break;
    case "update":
      await updateTask(arg[0], arg.slice(1).join(" ").trim());
      break;
    case "delete":
      await deleteTask(arg[0]);
      break;
    case "mark-done":
    case "mark-in-progress":
      await markTask(command, arg[0]);
      break;
    default:
      printError(`Command '${command}' not found.`);
      showHelp();
      break;
  }
}

async function readTasks() {
  const rawData = await fs.readFile(filepath, { encoding: "utf8" });
  if (!rawData.trim()) return [];

  try {
    return JSON.parse(rawData);
  } catch {
    throw new Error("task.json is corrupted (invalid JSON).");
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(filepath, JSON.stringify(tasks, null, 2), {
    encoding: "utf8",
  });
}

// function to create task
async function createTask(description) {
  if (!description) {
    printError(
      "Description is required. Example: task-cli add 'Buy groceries'",
    );
    return;
  }

  const tasks = await readTasks();
  const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  tasks.push({
    id: nextId,
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: null,
  });

  await writeTasks(tasks);
  console.log(`Task added successfully (ID: ${nextId})`);
}

async function markTask(command, taskId) {
  const id = parseId(taskId, `task-cli ${command} <id>`);
  if (id === null) return;

  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    printError(`Task with ID ${id} not found.`);
    return;
  }

  const statusMap = {
    "mark-done": "done",
    "mark-in-progress": "in-progress",
  };

  task.status = statusMap[command];
  task.updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  console.log(`Task ${id} marked as ${task.status}.`);
}

async function updateTask(taskId, description) {
  const id = parseId(taskId, "task-cli update <id> <description>");
  if (id === null) return;

  if (!description) {
    printError(
      "Task description is required. Usage: task-cli update <id> <description>",
    );
    return;
  }

  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    printError(`Task with ID ${id} not found.`);
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
}

async function deleteTask(taskId) {
  const id = parseId(taskId, "task-cli delete <id>");
  if (id === null) return;

  const tasks = await readTasks();
  const remaining = tasks.filter((t) => t.id !== id);

  if (remaining.length === tasks.length) {
    printError(`Task with ID ${id} not found.`);
    return;
  }

  await writeTasks(remaining);
  console.log(`Task ${id} deleted successfully.`);
}

async function getAllTask(status) {
  if (status && !VALID_STATUSES.includes(status)) {
    printError(
      `Invalid status '${status}'. Use one of: ${VALID_STATUSES.join(", ")}`,
    );
    return;
  }

  const tasks = (await readTasks())
    .filter((t) => !status || t.status === status)
    .map(({ id, description, status }) => ({ id, description, status }));

  if (!tasks.length) {
    printInfo(
      status
        ? `There are no tasks marked as '${status}' yet`
        : "There are no tasks yet",
    );
  } else {
    console.log(tasks);
  }
}

taskApp();
