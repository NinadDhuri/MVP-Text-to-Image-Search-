import axios from 'axios';
import FormData from 'form-data';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: 'Invalid upload' });
      return;
    }

    const file = files.image;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const payload = new FormData();
    payload.append('image', fs.createReadStream(file.filepath), file.originalFilename);
    payload.append('tags', fields.tags || '');

    try {
      const response = await axios.post(`${API_BASE}/api/upload`, payload, {
        headers: payload.getHeaders(),
      });
      res.status(response.status).json(response.data);
    } catch (uploadError) {
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}
