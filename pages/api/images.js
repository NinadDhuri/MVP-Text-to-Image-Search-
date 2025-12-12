import axios from 'axios';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await axios.get(`${API_BASE}/api/images`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load images' });
  }
}
