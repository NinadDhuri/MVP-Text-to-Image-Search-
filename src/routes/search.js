const express = require('express');
const { listImages } = require('../models/Image');
const { extractKeywords } = require('../services/tagService');
const { generateEmbedding, cosineSimilarity } = require('../services/clipService');

const router = express.Router();

router.post('/', (req, res) => {
  const query = req.body.query || '';
  const keywords = extractKeywords(query);
  const embedding = generateEmbedding(keywords.join(' '));
  const images = listImages();
  const scored = images
    .map((image) => ({
      ...image,
      score: cosineSimilarity(embedding, image.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json({ query, results: scored });
});

module.exports = router;
