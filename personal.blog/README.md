# personal.blog

A simple personal blog built with Node.js, Express, and EJS. Visitors can read articles; the owner manages articles (create, edit, delete) from an admin area protected by HTTP Basic Auth. Articles are stored as JSON files in the `articles/` folder, no database needed.

Project URL: https://roadmap.sh/projects/personal-blog

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 20.6 or newer (uses `node --env-file`)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/personal.blog
npm install
```

Create a `.env` file (see `.env.example`). The admin credentials are required, the server refuses to start without them.

```env
ADMIN_USER=admin
ADMIN_PASS=your-strong-password
```

## Running

```bash
npm start      # production
npm run dev    # auto-restart on file changes
```

Open http://localhost:3000.

## Pages

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | List of articles, newest first |
| `/articles/:id` | Public | Single article page |
| `/admin` | Admin | Dashboard listing all articles with edit/delete links |
| `/admin/new` | Admin | Form to create an article |
| `/admin/edit/:id` | Admin | Form to edit an article |
| `/admin/delete/:id` | Admin | Confirmation page; deleting is done with a `POST` |

Each article has a title (max 150 characters), content, and a publication date (`YYYY-MM-DD`). The article ID is a slug generated from the title (`Halo Dunia` becomes `halo-dunia`); a numeric suffix is added when the slug already exists.

## Data

Each article is a file in `articles/<id>.json`:

```json
{
  "id": "halo-dunia",
  "title": "Halo Dunia",
  "content": "Ini artikel pertama.\nBaris kedua.",
  "publishedAt": "2026-11-20"
}
```

## Security notes

- Admin routes require HTTP Basic Auth; credentials are compared in constant time.
- No default credentials: `ADMIN_USER` and `ADMIN_PASS` must be set.
- Article IDs are validated against `^[a-z0-9]+(?:-[a-z0-9]+)*$`, which prevents path traversal.
- Use HTTPS in production, since Basic Auth sends credentials on every request.
