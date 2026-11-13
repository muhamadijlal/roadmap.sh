import express from "express";
import { convert } from "./convert.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: "Invalid request body" });
});

app.post("/api/convert", (req, res) => {
  try {
    const result = convert(req.body);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
