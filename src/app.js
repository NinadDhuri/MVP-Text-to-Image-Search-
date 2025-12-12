const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/images');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const { ensureDatabase } = require('./models/Image');

const app = express();
const port = process.env.PORT || 4000;

ensureDatabase();

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../storage/images')));
app.use('/routes/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/images', imageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
