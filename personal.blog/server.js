import * as articles from "./lib/articles.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false })); // baca data dari <form>
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res, next) => {
  try {
    res.render("home", { articles: await articles.getAll() });
  } catch (e) {
    next(e);
  }
});

app.get("/articles/:id", async (req, res, next) => {
  try {
    const article = await articles.getById(req.params.id);
    if (!article) return next();

    res.render("article", { article });
  } catch (e) {
    next(e);
  }
});

// ===== Admin =====
const admin = express.Router();
admin.use(requireAuth); // semua route di router ini wajib login

const today = () => new Date().toISOString().slice(0, 10);

// Dashboard
admin.get("/", async (req, res, next) => {
  try {
    res.render("admin/dashboard", { articles: await articles.getAll() });
  } catch (e) {
    next(e);
  }
});

// Form Add
admin.get("/new", (req, res) => {
  res.render("admin/form", {
    heading: "Artikel Baru",
    action: "/admin/new",
    values: {
      title: "",
      content: "",
      publishedAt: today(),
    },
    errors: [],
  });
});

// Simpan Add
admin.post("/new", async (req, res, next) => {
  try {
    const { values, errors } = articles.validate(req.body);

    if (errors.length) {
      return res.status(400).render("admin/form", {
        heading: "Artikel Baru",
        action: "/admin/new",
        values,
        errors,
      });
    }

    await articles.create(values);
    res.redirect("/admin");
  } catch (e) {
    next(e);
  }
});

// Form Edit
admin.get("/edit/:id", async (req, res, next) => {
  try {
    const article = await articles.getById(req.params.id);
    if (!article) return next();

    res.render("admin/form", {
      heading: "Edit Artikel",
      action: `/admin/edit/${article.id}`,
      values: {
        title: article.title,
        content: article.content,
        publishedAt: article.publishedAt,
      },
      errors: [],
    });
  } catch (e) {
    next(e);
  }
});

// Simpan Edit
admin.post("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { values, errors } = articles.validate(req.body);

    if (errors.length) {
      return res.status(400).render("admin/form", {
        heading: "Edit Artikel",
        action: `/admin/edit/${id}`,
        values,
        errors,
      });
    }

    const saved = await articles.update(id, values);
    if (!saved) return next();
    res.redirect("/admin");
  } catch (e) {
    next(e);
  }
});

// Halaman konfirmasi hapus (tanpa JavaScript, jadi pakai halaman sendiri)
admin.get("/delete/:id", async (req, res, next) => {
  try {
    const article = await articles.getById(req.params.id);
    if (!article) return next();

    res.render("admin/delete", { article });
  } catch (e) {
    next(e);
  }
});

// Hapus
admin.post("/delete/:id", async (req, res, next) => {
  try {
    const ok = await articles.remove(req.params.id);
    if (!ok) return next();

    res.redirect("/admin");
  } catch (e) {
    next(e);
  }
});

app.use("/admin", admin);

// 404: dijalankan kalau tidak ada route yang cocok
app.use((req, res) => {
  res.status(404).render("404");
});

// Error handler: wajib punya 4 parameter
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Terjadi kesalahan pada server.");
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
