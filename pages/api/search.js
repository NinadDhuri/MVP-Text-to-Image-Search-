import axios from 'axios';

const API_BASE =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await axios.post(`${API_BASE}/api/search`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
