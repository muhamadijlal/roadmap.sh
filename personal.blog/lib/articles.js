import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "articles");

// id hanya boleh huruf kecil, angka, dan tanda minus.
// Ini mencegah path traversal seperti "../../server".
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidId(id) {
  return typeof id === "string" && ID_PATTERN.test(id);
}

function fileOf(id) {
  return path.join(dir, `${id}.json`);
}

export function validate(body) {
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const publishedAt = String(body.publishedAt ?? "").trim();

  const errors = [];

  if (!title) errors.push("Judul wajib diisi.");
  else if (title.length > 150) errors.push("Judul maksimal 150 karakter.");
  if (!content) errors.push("Isi artikel wajib diisi.");

  const d = new Date(`${publishedAt}T00:00:00Z`);
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(publishedAt) &&
    !Number.isNaN(d.getTime()) &&
    d.toISOString().slice(0, 10) === publishedAt;

  if (!validDate) errors.push("Tanggal publikasi tidak valid.");

  return {
    values: { title, content, publishedAt },
    errors,
  };
}

export function slugify(title) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "artikel"
  );
}

export async function getAll() {
  await fs.mkdir(dir, { recursive: true });
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));

  const articles = await Promise.all(
    files.map(async (f) =>
      JSON.parse(await fs.readFile(path.join(dir, f), "utf-8")),
    ),
  );

  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getById(id) {
  if (!isValidId(id)) return null;

  try {
    return JSON.parse(await fs.readFile(fileOf(id), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

export async function create({ title, content, publishedAt }) {
  await fs.mkdir(dir, { recursive: true });

  const base = slugify(title);
  let id = base;
  let n = 2;
  while (await getById(id)) id = `${base}-${n++}`;

  const article = { id, title, content, publishedAt };
  await fs.writeFile(fileOf(id), JSON.stringify(article, null, 2));

  return article;
}

export async function update(id, { title, content, publishedAt }) {
  if (!(await getById(id))) return null;

  const article = { id, title, content, publishedAt };
  await fs.writeFile(fileOf(id), JSON.stringify(article, null, 2));

  return article;
}

export async function remove(id) {
  if (!isValidId(id)) return false;

  try {
    await fs.unlink(fileOf(id));
    return true;
  } catch (e) {
    if (e.code === "ENOENT") return false;
    throw e;
  }
}
