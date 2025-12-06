import React, { useState } from 'react';
import '../styles/url.css'; // ✅ Import external CSS

const UrlScannerForm = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // ✅ Use direct backend URL OR proxy depending on your setup
      const response = await fetch('http://localhost:4000/api/tools/url-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ safe: false, reason: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-scanner-container">
      <h2>🔍 URL Scanner</h2>
      <form className="url-scanner-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" disabled={!url || loading}>
          {loading ? 'Scanning...' : 'Scan URL'}
        </button>
      </form>

      {result && (
        <div className={`result-box ${result.safe ? 'safe' : 'unsafe'}`}>
          <h3>Result:</h3>
          <p><strong>Safe:</strong> {result.safe ? '✅ Yes' : '❌ No'}</p>
          {result.reason && <p><strong>Reason:</strong> {result.reason}</p>}
          {result.ip && <p><strong>IP:</strong> {result.ip}</p>}
          {result.statusCode && <p><strong>Status Code:</strong> {result.statusCode}</p>}
        </div>
      )}
    </div>
  );
};

export default UrlScannerForm;
