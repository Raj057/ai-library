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
        {/* <p>{result.summary || 'No summary available.'}</p> */}
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">BookID</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Genre</th>
            <th className="px-4 py-2">Section</th>
            <th className="px-4 py-2">Column</th>
            <th className="px-4 py-2">Available Copies</th>
          </tr>
        </thead>
        <tbody>
          {result.result.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No books available</td>
            </tr>
          ) : (
            result.result.map((book) => (
              <tr key={book._id}>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.book_id}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">{book.genre}</td>
                <td className="border px-4 py-2">{book.section}</td>
                <td className="border px-4 py-2">{book.column}</td>
                <td className="border px-4 py-2">{book.available_copies}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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