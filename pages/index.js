import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/images');
      const data = await res.json();
      setResults(data.images || []);
    })();
  }, []);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>Automotive Text-to-Image Search</h1>
      <p>Search using natural language and view the best matching images.</p>
      <form onSubmit={search} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="e.g. luxury red car with sunroof"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {results.map((image) => (
          <article key={image.id || image.filename} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
            <img
              src={`${API_BASE}/images/${image.filename}`}
              alt={image.originalName}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <p style={{ margin: '0.25rem 0' }}>{image.originalName}</p>
            {typeof image.score === 'number' && (
              <p style={{ margin: '0.25rem 0', color: '#666' }}>Score: {image.score.toFixed(3)}</p>
            )}
            <small>Tags: {(image.tags || []).join(', ')}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
