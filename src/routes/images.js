const express = require('express');
const { listImages } = require('../models/Image');

const router = express.Router();

router.get('/', (_req, res) => {
  const images = listImages();
  res.json({ images });
});

module.exports = router;
