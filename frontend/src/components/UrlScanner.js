// Import React and useState hook for managing state
import React, { useState } from 'react';
// Import CSS file for styling the URL scanner form
import '../styles/url.css'; // ✅ Import external CSS

// Define UrlScannerForm component
const UrlScannerForm = () => {
  // State to store the entered URL
  const [url, setUrl] = useState('');
  // State to store the result returned from backend
  const [result, setResult] = useState(null);
  // State to track loading status while scanning
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload
    setLoading(true);   // Show loading state
    setResult(null);    // Clear previous result

    try {
      // Send POST request to backend URL scanner API
      const response = await fetch('http://localhost:4000/api/tools/url-scanner', {
        method: 'POST', // Use POST method
        headers: { 'Content-Type': 'application/json' }, // Send JSON data
        body: JSON.stringify({ url }), // Request body with entered URL
      });

      // Parse response JSON
      const data = await response.json();
      // Save result in state
      setResult(data);
    } catch (err) {
      // If request fails, set result as unsafe with reason
      setResult({ safe: false, reason: 'Request failed' });
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Return JSX for rendering
  return (
    <div className="url-scanner-container"> {/* Container div */}
      <h2>🔍 URL Scanner</h2> {/* Title */}
      <form className="url-scanner-form" onSubmit={handleSubmit}> {/* Form with submit handler */}
        <input
          type="text" // Input type text
          placeholder="Enter a URL (e.g. https://example.com)" // Placeholder text
          value={url} // Bind input value to url state
          onChange={(e) => setUrl(e.target.value)} // Update url state on change
        />
        <button type="submit" disabled={!url || loading}> {/* Disable if no URL or loading */}
          {loading ? 'Scanning...' : 'Scan URL'} {/* Show text based on loading state */}
        </button>
      </form>

      {/* Show result if available */}
      {result && (
        <div className={`result-box ${result.safe ? 'safe' : 'unsafe'}`}> {/* Box styled safe/unsafe */}
          <h3>Result:</h3>
          <p><strong>Safe:</strong> {result.safe ? '✅ Yes' : '❌ No'}</p> {/* Show safe status */}
          {result.reason && <p><strong>Reason:</strong> {result.reason}</p>} {/* Show reason if exists */}
          {result.ip && <p><strong>IP:</strong> {result.ip}</p>} {/* Show IP if exists */}
          {result.statusCode && <p><strong>Status Code:</strong> {result.statusCode}</p>} {/* Show status code if exists */}
        </div>
      )}
    </div>
  );
};

// Export UrlScannerForm component
export default UrlScannerForm;
