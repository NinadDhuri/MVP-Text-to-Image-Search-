import { useEffect, useState } from 'react';

export default function Admin() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    const res = await fetch('/api/images');
    const data = await res.json();
    setImages(data.images || []);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please choose an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tags', tags);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (response.ok) {
      setMessage('Uploaded successfully');
      setFile(null);
      setTags('');
      loadImages();
    } else {
      setMessage(data.error || 'Upload failed');
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>Admin: Upload Automotive Images</h1>
      <form onSubmit={submit} style={{ marginBottom: '1rem' }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ display: 'block' }}>Manual tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="red, sedan, sunroof"
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}

      <section>
        <h2>Uploaded Images</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {images.map((image) => (
            <article key={image.id} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/images/${image.filename}`}
                alt={image.originalName}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <p style={{ margin: '0.25rem 0' }}>{image.originalName}</p>
              <small>Tags: {(image.tags || []).join(', ')}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
