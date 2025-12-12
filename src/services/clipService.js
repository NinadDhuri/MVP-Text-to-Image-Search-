const crypto = require('crypto');

const DIMENSIONS = 128;

const hashToken = (token) => {
  const hash = crypto.createHash('sha256').update(token).digest();
  const vector = new Array(DIMENSIONS).fill(0);
  for (let i = 0; i < DIMENSIONS; i += 1) {
    vector[i] = hash[i % hash.length] / 255;
  }
  return vector;
};

const generateEmbedding = (text) => {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) {
    return new Array(DIMENSIONS).fill(0);
  }
  const vectors = tokens.map(hashToken);
  const embedding = new Array(DIMENSIONS).fill(0);
  vectors.forEach((vec) => {
    vec.forEach((value, index) => {
      embedding[index] += value;
    });
  });
  return embedding.map((value) => value / tokens.length);
};

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (normA * normB);
};

module.exports = { generateEmbedding, cosineSimilarity };
