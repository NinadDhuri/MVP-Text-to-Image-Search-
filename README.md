# MVP Text-to-Image Search

Minimal viable product for searching automotive images using simple text queries. The stack uses Next.js for the UI, Express for APIs, SQLite for metadata, and local file storage for images.

## Getting started

```bash
npm install
npm run dev
npm run build
npm run start
```

- Next.js runs on http://localhost:3000
- Express API runs on http://localhost:4000
- Configure a different API base with `API_BASE_URL` (server) and `NEXT_PUBLIC_API_BASE` (client)

## Features

- Upload automotive images with drag-and-drop or file selector via the admin page (`/admin`)
- Automatic tag suggestions based on predefined categories
- Lightweight embedding generation to approximate CLIP matching for local development
- Keyword-based search returning the top 10 matches with similarity scores
- Metadata and embeddings stored in SQLite with local image storage

## Architecture

Frontend (Next.js)
pages/
├── index.js # Search interface
├── admin.js # Upload and tag images
└── api/
    ├── search.js # Search endpoint
    ├── upload.js # Image upload
    └── images.js # Image metadata

Backend (Node.js)
src/
├── app.js # Express server
├── routes/
│   ├── search.js # Search logic
│   ├── upload.js # Image processing
│   └── images.js # Image metadata
├── services/
│   ├── clipService.js # CLIP embedding generation
│   ├── tagService.js # Automatic tag extraction
│   └── imageService.js # Image processing
└── models/
    └── Image.js # Image metadata model

## Notes

- Uploads are limited to 100 images to align with the MVP scope.
- Embedding and search use a deterministic hash-based vector to avoid heavy ML dependencies; swap `clipService` with a real CLIP encoder when available.
