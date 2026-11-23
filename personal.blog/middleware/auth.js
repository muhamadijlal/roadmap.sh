import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Tidak ada kredensial bawaan: server menolak jalan kalau belum di-set.
if (!ADMIN_USER || !ADMIN_PASS) {
  throw new Error(
    "ADMIN_USER dan ADMIN_PASS wajib di-set (lihat file .env).",
  );
}

// Bandingkan string dengan waktu konstan supaya tahan timing attack.
// Hash dulu agar panjang buffer selalu sama (timingSafeEqual mewajibkan itu).
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();

  return crypto.timingSafeEqual(ha, hb);
}

function deny(res) {
  res.set("WWW-Authenticate", 'Basic realm="Admin", charset="UTF-8"');
  return res.status(401).send("Autentikasi diperlukan.");
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) return deny(res);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep === -1) return deny(res);

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1); // password boleh mengandung ":"

  // Pakai & (bukan &&) supaya kedua perbandingan selalu dijalankan
  if (safeEqual(user, ADMIN_USER) & safeEqual(pass, ADMIN_PASS)) {
    return next();
  }

  return deny(res);
}
