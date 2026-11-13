# unit.converter

Aplikasi web sederhana untuk mengonversi satuan: **panjang**, **berat**, dan **suhu**. Terdiri dari backend Express (logika konversi) dan frontend React (Vite + Tailwind CSS).

Project URL: https://roadmap.sh/projects/unit-converter

Repository: https://github.com/muhamadijlal/roadmap.sh

## Persyaratan

- Node.js 20 atau lebih baru

## Instalasi

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/unit.converter

cd backend && npm install
cd ../frontend && npm install
```

## Menjalankan

Jalankan backend dan frontend di dua terminal terpisah.

```bash
# Terminal 1 - backend (http://localhost:3000)
cd unit.converter/backend
npm run dev

# Terminal 2 - frontend (http://localhost:5173)
cd unit.converter/frontend
npm run dev
```

Buka http://localhost:5173. Request ke `/api/*` diteruskan ke backend oleh proxy Vite, jadi tidak perlu setting CORS. Kalau backend memakai port lain, set `BACKEND_URL` saat menjalankan frontend (lihat [frontend/README.md](./frontend/README.md)).

## Satuan yang didukung

| Kategori | Satuan |
| --- | --- |
| `length` | `millimeter`, `centimeter`, `meter`, `kilometer`, `inch`, `foot`, `yard`, `mile` |
| `weight` | `milligram`, `gram`, `kilogram`, `ounce`, `pound` |
| `temperature` | `celsius`, `fahrenheit`, `kelvin` |

## API

```
POST /api/convert
Content-Type: application/json
```

Request:

```json
{ "category": "length", "value": 10, "from": "meter", "to": "foot" }
```

Response sukses (200):

```json
{ "result": 32.808399 }
```

Response gagal (400):

```json
{ "error": "Invalid unit: furlong" }
```

Contoh dengan curl:

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"category":"temperature","value":100,"from":"celsius","to":"fahrenheit"}'
# {"result":212}
```

Hasil dibulatkan hingga 6 angka desimal.

## Struktur

```
unit.converter/
  backend/
    server.js     server Express dan endpoint POST /api/convert
    convert.js    logika konversi length, weight, dan temperature
  frontend/       aplikasi React (Vite + Tailwind CSS)
```
