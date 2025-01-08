// Updated BookList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend } from '../lib/path';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${backend}/api/books`);
        setBooks(response.data);
      } catch (error) {
        setError('Error fetching books');
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Library Books</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Genre</th>
            <th className="px-4 py-2">Section</th>
            <th className="px-4 py-2">Column</th>
            <th className="px-4 py-2">Available Copies</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No books available</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book._id}>
                <td className="border px-4 py-2">{book.title}</td>
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
  );
};

export default BookList;