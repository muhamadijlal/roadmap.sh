# weather.api

A simple weather API built with Node.js and Express. It wraps the [Visual Crossing](https://www.visualcrossing.com/) weather API, returns a trimmed-down response (current conditions and a 7-day forecast), and caches results in Redis so repeated requests for the same city do not hit the upstream API again.

Project URL: https://roadmap.sh/projects/weather-api-wrapper-service

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 20.6 or newer (uses `node --env-file`)
- A free API key from [Visual Crossing](https://www.visualcrossing.com/weather-api)
- A running Redis server (optional at runtime: without Redis the API still works, just without caching)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/weather.api
npm install
```

Create a `.env` file (see `.env.example`).

```env
PORT=3000
API_KEY=your-visual-crossing-api-key
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=43200
```

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (default `3000`) |
| `API_KEY` | Visual Crossing API key. Required, the server refuses to start without it |
| `REDIS_URL` | Redis connection URL (default `redis://localhost:6379`) |
| `CACHE_TTL_SECONDS` | How long a cached city stays in Redis (default `43200`, which is 12 hours) |

## Running Redis

The easiest way is Docker:

```bash
docker run -d -p 6379:6379 --name redis redis
```

Check that it is running:

```bash
docker exec redis redis-cli ping
# PONG
```

## Running

```bash
npm run dev
```

The server starts at `http://localhost:3000` (or your `PORT`) and logs `Successfully connected to redis.` once Redis is reachable.

## Usage

```
GET /weather/:city
```

```bash
curl -i http://localhost:3000/weather/jakarta
```

Example response (values depend on the real weather):

```json
{
  "lokasi": "Jakarta, Jakarta, Indonesia",
  "timezone": "Asia/Jakarta",
  "sekarang": {
    "suhu": 32,
    "terasa": 37.8,
    "kelembapan": 62.7,
    "kondisi": "Partially cloudy",
    "icon": "partly-cloudy-day"
  },
  "prakiraan": [
    {
      "tanggal": "2026-11-26",
      "suhuMax": 33,
      "suhuMin": 25,
      "peluangHujan": 40,
      "kondisi": "Partially cloudy",
      "icon": "partly-cloudy-day"
    }
  ]
}
```

`prakiraan` contains up to 7 days. Temperatures are in Celsius.

## Caching

The route uses a cache-aside pattern:

1. The city name is normalized (`trim` and lowercase) into a key such as `weather:jakarta`, so `Jakarta` and `jakarta` share one cache entry.
2. If the key exists in Redis, the cached response is returned right away with the header `X-Cache: HIT`.
3. Otherwise the server calls Visual Crossing, stores the result in Redis with an expiry of `CACHE_TTL_SECONDS`, and returns it with `X-Cache: MISS`.

Only successful responses are cached. If Redis is down or not connected yet, the cache is skipped and every request is a `MISS`, but the API keeps working.

### Checking the cache

```bash
# first request is MISS, second request is HIT
curl -i http://localhost:3000/weather/jakarta
curl -i http://localhost:3000/weather/jakarta

# inspect Redis
docker exec redis redis-cli keys "weather:*"
docker exec redis redis-cli ttl weather:jakarta
docker exec redis redis-cli get weather:jakarta
```

## Rate limiting

- Global: 100 requests per 15 minutes per IP.
- `/weather/:city`: 10 requests per 15 minutes per IP. Successful requests are not counted.

When a limit is exceeded the API returns `429`.

## Errors

Errors are returned as JSON in the form `{ "code": <status>, "error": "<message>" }`.

| Status | When |
| --- | --- |
| `400` | The city is not valid (rejected by Visual Crossing) |
| `404` | Unknown route |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |
| `502` | Visual Crossing returned another error |
| `503` | Visual Crossing could not be reached |

If `API_KEY` is missing, the server prints an error and exits at startup.
