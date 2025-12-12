const fs = require('fs');
const path = require('path');

const storageDir = path.join(__dirname, '../../storage/images');

const ensureStorage = () => {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
};

const getMetadata = async (filePath) => {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath).replace('.', '').toLowerCase();
  return {
    size: stats.size,
    format: ext,
    width: null,
    height: null,
  };
};

module.exports = { ensureStorage, getMetadata, storageDir };
