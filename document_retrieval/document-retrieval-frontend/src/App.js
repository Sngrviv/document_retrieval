import React, { useState } from 'react';
import './App.css';
import { uploadAndQuery } from './services/api';
import { FaUpload, FaSpinner, FaSearch } from 'react-icons/fa';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!file) {
        throw new Error('Please select a file');
      }
      
      const result = await uploadAndQuery(file, query);
      setAnswer(result.answer);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Document Retrieval AI</h1>
        <p className="subtitle">Upload a document and ask questions about its content</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="form">
          <div className="upload-section">
            <label className="file-input-label">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".txt"
                className="file-input"
              />
              <span className="upload-button">
                <FaUpload className="icon" />
                Choose File
              </span>
              {fileName && <span className="file-name">{fileName}</span>}
            </label>
          </div>

          <div className="query-section">
            <label className="input-label">
              Ask a question about the document:
              <div className="search-input-container">
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your question here..."
                  className="search-input"
                  required
                />
                <FaSearch className="search-icon" />
              </div>
            </label>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Processing...
              </>
            ) : 'Submit'}
          </button>
        </form>

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {answer && (
          <div className="answer-container">
            <h2>Answer:</h2>
            <p className="answer-text">{answer}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;