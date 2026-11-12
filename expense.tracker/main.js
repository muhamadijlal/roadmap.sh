#! /usr/bin/env node

import { program } from "commander";
import { styleText } from "node:util";
import pkg from "./package.json" with { type: "json" };
import fs from "fs/promises";
import { fileURLToPath } from "node:url";
import path from "path";

// ================= DEFINED VARIABLES =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathfile = path.join(__dirname, "expense-tracker.json");

const banner = `
${styleText(["bold", "cyan"], "💸 Expense Tracker")} ${styleText("dim", `v${pkg.version}`)}
`;

const examples = `
${styleText("bold", "Contoh:")}
  $ expense-tracker add -d "Makan siang" -a 25000
  $ expense-tracker list
  $ expense-tracker summary --month 11
`;

function printError(e) {
  console.error(`error: ${e instanceof Error ? e.message : e}`);
  process.exitCode = 1;
}

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return rupiah.format(Number(value));
}

// ================= COMMAND PROGRAM =================

program
  .name("expense-tracker")
  .description(
    `
    "Catat, ubah, dan rangkum pengeluaran harianmu langsung dari terminal.",
  `,
  )
  .version(pkg.version, "-v, --version", "tampilkan versi aplikasi")
  .helpOption("-h, --help", "tampilkan bantuan")
  .helpCommand("help [command]", "tampilkan bantuan untuk command tertentu")
  .addHelpText("beforeAll", banner)
  .addHelpText("after", examples)
  .showHelpAfterError(
    styleText("yellow", "(jalankan 'expense-tracker --help' untuk bantuan)"),
  )
  .showSuggestionAfterError();

program
  .command("add")
  .description("tambah expenses")
  .requiredOption("-d, --description <text>", "deskripsi")
  .requiredOption("-a, --amount <number>", "jumlah")
  .action(addExpense);

program.command("list").description("list expenses").action(listExpense);

program
  .command("summary")
  .description("summary expenses")
  .option("--month <number>", "number of month")
  .action(summaryExpense);

program
  .command("delete")
  .description("delete expenses")
  .requiredOption("--id <number>", "id expense")
  .action(deleteExpense);

// ================= SERVICE FUNC =================

async function addExpense({ description, amount }) {
  try {
    const desc = String(description ?? "").trim();
    if (!desc) {
      throw new Error("description must not be empty");
    }

    const amt = Number(amount);
    if (!Number.isInteger(amt) || amt <= 0) {
      throw new Error("amount must be an integer greater than 0");
    }

    const raw = await readFileTracker(pathfile);
    const nextId = raw.length ? Math.max(...raw.map((r) => r.id)) + 1 : 1;

    raw.push({
      id: nextId,
      description: desc,
      amount: amt,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    await writeFileTracker(raw);
    console.log(`Expense added successfully (ID: ${nextId})`);
  } catch (e) {
    printError(e);
  }
}

async function listExpense() {
  try {
    const raw = await readFileTracker(pathfile);
    printExpenses(raw);
  } catch (e) {
    printError(e);
  }
}

async function summaryExpense({ month } = {}) {
  try {
    const expenses = await readFileTracker(pathfile);
    const currentYear = new Date().getFullYear();

    let filtered = expenses;

    if (month) {
      const m = Number(month);
      if (!Number.isInteger(m) || m < 1 || m > 12) {
        throw new Error("month must be between 1 and 12");
      }

      filtered = expenses.filter((e) => {
        const date = new Date(e.createdAt);
        return date.getMonth() + 1 === m && date.getFullYear() === currentYear;
      });
    }
    const total = filtered.reduce((acc, e) => acc + Number(e.amount), 0);

    if (month) {
      const monthName = new Date(currentYear, Number(month) - 1).toLocaleString(
        "en-US",
        { month: "long" },
      );
      console.log(`Total expenses for ${monthName}: ${formatCurrency(total)}`);
    } else {
      console.log(`Total expenses: ${formatCurrency(total)}`);
    }
  } catch (e) {
    printError(e);
  }
}

async function deleteExpense({ id }) {
  try {
    const expenseId = Number(id);

    if (!Number.isInteger(expenseId)) {
      throw new Error("expense id must be type integer");
    }

    const raw = await readFileTracker(pathfile);

    if (!raw.some((r) => r.id === expenseId)) {
      throw new Error(`expense id: ${expenseId} not found!`);
    }

    const filtered = raw.filter((r) => r.id !== expenseId);

    await writeFileTracker(filtered);
    console.log(`expense id: ${expenseId} has been deleted!`);
  } catch (e) {
    printError(e);
  }
}

// ================= UTILS FUNC =================
async function checkFile(pathfile) {
  try {
    await fs.access(pathfile);
    return true;
  } catch (e) {
    return false;
  }
}

async function writeFileTracker(payload) {
  try {
    await fs.writeFile(pathfile, JSON.stringify(payload, null, 2), {
      encoding: "utf8",
    });
  } catch (e) {
    throw new Error(`writeFileTracker: gagal menulis file ${pathfile}`, {
      cause: e,
    });
  }
}

async function readFileTracker(pathfile) {
  if (!pathfile) {
    throw new Error("pathfile is required!");
  }

  // file belum ada = belum ada data; akan dibuat saat pertama kali menulis
  if (!(await checkFile(pathfile))) return [];

  try {
    const raw = await fs.readFile(pathfile, { encoding: "utf8" });
    if (!raw.trim()) return [];

    return JSON.parse(raw);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        `readFileTracker: isi file ${pathfile} bukan JSON valid`,
        { cause: e },
      );
    }

    throw new Error(`readFileTracker: gagal membaca file ${pathfile}`, {
      cause: e,
    });
  }
}

function printExpenses(expenses) {
  const header = ["ID", "Date", "Description", "Amount"];

  const rows = expenses.map((e) => [
    String(e.id),
    new Date(e.createdAt).toLocaleDateString("en-CA"), // format YYYY-MM-DD, zona waktu lokal
    e.description,
    formatCurrency(e.amount),
  ]);

  // lebar tiap kolom = teks terpanjang di kolom itu (termasuk header)
  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length)),
  );

  const formatRow = (cols) =>
    ("# " + cols.map((c, i) => c.padEnd(widths[i])).join("  ")).trimEnd();

  console.log(formatRow(header));
  rows.forEach((r) => console.log(formatRow(r)));
}

program.parse();
