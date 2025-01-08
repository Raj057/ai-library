// Updated ChatInterface.js
import React, { useState } from 'react';
import axios from 'axios';
import VoiceQuery from './VoiceQuery';
import { backend } from '../lib/path';

const ChatInterface = ({ userType, studentId }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoiceQuery = (recognizedText) => {
    setQuery(recognizedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${backend}/api/llm/query`, {
        query,
        userType,
        studentId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponse(res.data);
    } catch (error) {
      console.error('Error sending query:', error.response ? error.response.data : error.message);
      setError('There was an error processing your query.');
    } finally {
      setLoading(false);
    }
  };

  const renderToolResults = () => {
    if (!response || !response.toolResults || response.toolResults.length === 0) {
      return <p className="text-gray-600">No results found</p>;
    }

    return response.toolResults.map((result, index) => (
      <div key={index} className="result-item border-b p-2">
        <h3 className="text-lg font-bold">Result:</h3>
        <p>{result.summary || 'No summary available.'}</p>
      </div>
    ));
  };

  return (
    <div className="chat-interface">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-4 py-2 w-full"
            placeholder="Type your query here..."
          />
          <VoiceQuery onQuery={handleVoiceQuery} />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {response && renderToolResults()}
    </div>
  );
};

export default ChatInterface;