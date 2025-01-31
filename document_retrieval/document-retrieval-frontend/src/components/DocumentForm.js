import React, { useState } from 'react';

function DocumentForm() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', question);

    try {
        console.log('Sending request...');  // Debug log
        const response = await fetch('http://127.0.0.1:8000/api/upload-and-query/', {
            method: 'POST',
            body: formData,
        });

        console.log('Response status:', response.status);  // Debug log
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);  // Debug log
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);  // Debug log
        setAnswer(data.answer);
    } catch (err) {
        console.error('Fetch error:', err);  // Debug log
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <div>
      <h1>Document Retrieval AI</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload a document (text file):</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            accept=".txt"
          />
        </div>
        <div>
          <label>Ask a question about the document:</label>
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading || !file || !question}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {answer && (
        <div className="answer">
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentForm;