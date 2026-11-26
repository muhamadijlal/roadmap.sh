import axios from "axios";
import process from "process";
import express from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { createClient } from "redis";

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS) || 43200;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

if (!API_KEY) {
  console.error("API_KEY tidak ada perlu di set di .env");
  process.exit(1);
}

// ========== Redis configuration ==========
// Create redis connection
const client = createClient({
  url: process.env.REDIS_URL,
  disableOfflineQueue: true, // perintah langsung gagal ketika redis mati
});

// Error handling
client.on("error", (err) => {
  console.error(`Redis connection error: ${err}`);
});

// cacheGet
async function cacheGet(key) {
  if (!client.isReady) return null;

  try {
    return await client.get(key);
  } catch (e) {
    return null;
  }
}

// cacheSet
async function cacheSet(key, value) {
  if (!client.isReady) return;

  try {
    await client.set(key, value, { EX: CACHE_TTL });
  } catch (e) {
    console.error(`cacheSet error: ${e}`);
  }
}

// Redis connection
const connectRedis = async () => {
  await client.connect();
};

connectRedis().catch(console.error);

// Redis ready
client.on("ready", () => {
  console.log("Successfully connected to redis.");
});

const app = express();

// Limiter Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 100, // Maksimal request per window
  standardHeaders: "draft-8", // Mengirim header standar RateLimit
  legacyHeaders: false, // Menonaktifkan header X-RateLimit-* lama
  message: {
    status: 429,
    error: "Terlalu banyak permintaan, coba lagi nanti.",
  },
});

// Limiter Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const username = (req.body?.username || "").toLowerCase();
    return `${ipKeyGenerator(req.ip)}:${username}`;
  },
  message: {
    status: 429,
    error: "Terlalu banyak percobaan login. Tunggu 15 menit.",
  },
});

app.use(globalLimiter);

app.get("/weather/:city", loginLimiter, async (req, res, next) => {
  try {
    const { city } = req.params;

    // 1. Buat cache key yang konsisten
    const key = `weather:${city.trim().toLowerCase()}`;

    // 2. Cek cache dulu
    const cached = await cacheGet(key);

    if (cached) {
      res.set("X-Cache", "HIT");
      return res.type("json").send(cached);
    }

    const API_URL = `${BASE_URL}/${encodeURIComponent(city)}`;

    const resp = await axios.get(API_URL, {
      params: {
        unitGroup: "metric",
        key: API_KEY,
        contentType: "json",
        include: "current,days", // buang hours, alerts, stations
        elements:
          "datetime,temp,tempmax,tempmin,feelslike,humidity,precipprob,conditions,icon",
      },
      timeout: 10000,
    });

    const {
      resolvedAddress,
      timezone,
      currentConditions: now = {},
      days = [],
    } = resp.data;

    const data = {
      lokasi: resolvedAddress,
      timezone,
      sekarang: {
        suhu: now.temp,
        terasa: now.feelslike,
        kelembapan: now.humidity,
        kondisi: now.conditions,
        icon: now.icon,
      },
      prakiraan: days.slice(0, 7).map((d) => ({
        tanggal: d.datetime,
        suhuMax: d.tempmax,
        suhuMin: d.tempmin,
        peluangHujan: d.precipprob,
        kondisi: d.conditions,
        icon: d.icon,
      })),
    };

    await cacheSet(key, JSON.stringify(data));

    res.set("X-Cache", "MISS");
    res.send(data);
  } catch (e) {
    if (e.response) {
      const status = e.response.status;

      if (status === 400) {
        return res.status(400).json({ code: 400, error: "Kota tidak valid" });
      }

      console.error(e.message);
      return res
        .status(502)
        .json({ code: 502, error: "Weather API mengembalikan error" });
    }

    if (e.request) {
      return res
        .status(503)
        .json({ code: 503, error: "Weather API tidak dapat dijangkau" });
    }

    next(e);
  }
});

app.use((req, res) => {
  res.status(404).json({ code: 404, error: "Halaman tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, error: "Terjadi kesalahan pada server" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
