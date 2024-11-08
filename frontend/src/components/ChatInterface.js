import React, { useState } from 'react';
import axios from 'axios';
import VoiceQuery from './VoiceQuery';

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
      const res = await axios.post('http://localhost:5000/api/llm/query', {
        query,
        userType,
        studentId,
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

    return response.toolResults.map((result, index) => {
      if (!result.result || result.result.length === 0) {
        return (
          <div key={index} className="result-item border-b p-2">
            <p className="text-gray-500">No book data available for this query.</p>
          </div>
        );
      }
      return result.result.map((book, bookIndex) => (
        <div key={bookIndex} className="result-item border-b p-2">
          <h3 className="text-lg font-bold">Book Found:</h3>
          <p><strong>Title:</strong> {book.title || 'N/A'}</p>
          <p><strong>Author:</strong> {book.author || 'N/A'}</p>
          <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
          <p><strong>Section:</strong> {book.section || 'N/A'}</p>
          <p><strong>Column:</strong> {book.column || 'N/A'}</p>
        </div>
      ));
      
      /*const book = result.result[0];
      return (
        <div key={index} className="result-item border-b p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-bold">Book Found:</h3>
          <p><strong>Title:</strong> {book.title || 'N/A'}</p>
          <p><strong>Author:</strong> {book.author || 'N/A'}</p>
          <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
          <p><strong>Section:</strong> {book.section || 'N/A'}</p>
          <p><strong>Column:</strong> {book.column || 'N/A'}</p>
        </div>
      );*/
    });
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
