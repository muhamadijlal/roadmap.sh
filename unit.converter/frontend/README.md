# Unit Converter – Frontend

Frontend React (Vite + Tailwind CSS) untuk project [Unit Converter](https://roadmap.sh/projects/unit-converter). Proses konversinya dilakukan oleh backend Express di folder `../backend`.

## Menjalankan

```bash
cd unit.converter/frontend
npm install
npm run dev
```

Buka http://localhost:5173.

Backend Express harus berjalan di **http://localhost:3000**. Semua request ke `/api/*` diteruskan ke sana oleh proxy Vite (lihat `vite.config.js`), jadi backend tidak perlu setting CORS.

Kalau backend memakai port lain:

```bash
# Git Bash
BACKEND_URL=http://localhost:4000 npm run dev
```

## Kontrak API

Frontend memanggil satu endpoint:

```
POST /api/convert
Content-Type: application/json
```

**Request body**

```json
{
  "category": "length",
  "value": 10,
  "from": "meter",
  "to": "foot"
}
```

| Field | Tipe | Keterangan |
| --- | --- | --- |
| `category` | string | `length`, `weight`, atau `temperature` |
| `value` | number | angka yang dikonversi (bisa desimal atau negatif) |
| `from` | string | key satuan asal (lihat tabel di bawah) |
| `to` | string | key satuan tujuan |

**Response sukses (200)**

```json
{ "result": 32.8084 }
```

`result` harus berupa **number**, bukan string.

**Response gagal (400 / 500)**

```json
{ "error": "Invalid unit" }
```

Isi `error` ditampilkan langsung ke user.

## Key satuan

| Category | Key |
| --- | --- |
| `length` | `millimeter`, `centimeter`, `meter`, `kilometer`, `inch`, `foot`, `yard`, `mile` |
| `weight` | `milligram`, `gram`, `kilogram`, `ounce`, `pound` |
| `temperature` | `celsius`, `fahrenheit`, `kelvin` |

Daftar ini ada di `src/units.js`. Kalau kamu menambah satuan di backend, tambahkan juga di file itu.

## Struktur

```
src/
  main.jsx    entry point React
  App.jsx     tampilan: tab, form, dan hasil
  api.js      fungsi pemanggil POST /api/convert
  units.js    daftar kategori dan satuan
  index.css   import Tailwind
```
