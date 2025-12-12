const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const databasePath = path.join(__dirname, '../../data/database.sqlite');

const ensureDatabase = () => {
  const dir = path.dirname(databasePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(databasePath);
  db.prepare(
    `CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      size INTEGER NOT NULL,
      format TEXT NOT NULL,
      width INTEGER,
      height INTEGER,
      tags TEXT NOT NULL,
      embedding TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`
  ).run();
  db.close();
};

const getDb = () => new Database(databasePath);

const insertImage = (image) => {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO images (id, filename, originalName, size, format, width, height, tags, embedding, createdAt) VALUES (@id, @filename, @originalName, @size, @format, @width, @height, @tags, @embedding, @createdAt)'
  );
  stmt.run({
    id: uuidv4(),
    filename: image.filename,
    originalName: image.originalName,
    size: image.size,
    format: image.format,
    width: image.width || null,
    height: image.height || null,
    tags: JSON.stringify(image.tags),
    embedding: JSON.stringify(image.embedding),
    createdAt: new Date().toISOString(),
  });
  db.close();
};

const listImages = () => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM images ORDER BY createdAt DESC').all();
  db.close();
  return rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags),
    embedding: JSON.parse(row.embedding),
  }));
};

const countImages = () => {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as total FROM images').get();
  db.close();
  return row.total;
};

module.exports = { ensureDatabase, insertImage, listImages, countImages };
