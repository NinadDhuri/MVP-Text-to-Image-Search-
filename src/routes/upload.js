const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { insertImage, countImages } = require('../models/Image');
const { autoTag, combineTags } = require('../services/tagService');
const { generateEmbedding } = require('../services/clipService');
const { ensureStorage, getMetadata, storageDir } = require('../services/imageService');

ensureStorage();

const upload = multer({ dest: storageDir });
const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (countImages() >= 100) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Image limit reached (100)' });
    }

    const { originalname, filename, path: filePath } = req.file;
    const metadata = await getMetadata(filePath);
    const inferredTags = autoTag(`${originalname} ${req.body.tags || ''}`);
    const tags = combineTags(req.body.tags, inferredTags);
    const embeddingText = `${tags.join(' ')} ${originalname}`;
    const embedding = generateEmbedding(embeddingText);

    insertImage({
      filename,
      originalName: originalname,
      size: metadata.size,
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      tags,
      embedding,
    });

    res.json({
      message: 'Uploaded successfully',
      image: {
        filename,
        originalName: originalname,
        ...metadata,
        tags,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
