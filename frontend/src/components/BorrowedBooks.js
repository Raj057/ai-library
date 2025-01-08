// Updated BorrowedBooks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend } from '../lib/path';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backend}/api/students/borrowed`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);
        setBorrowedBooks(response.data.books);
        setData(response.data.student);
      } catch (error) {
        setError('Error fetching borrowed books.');
        console.error(error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  return (
    <div>
      <h2>Your Borrowed Books</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{data ? JSON.stringify(data, null, 2) : ''}</p>
      <ul>
        {borrowedBooks.length > 0 ? (
          borrowedBooks.map((book) => (
            <li key={book._id}>
              {book.title}, {" Fine:"}{data.fine}, {" Days late:"} {data.days_left*-1}
            </li>
          ))
        ) : (
          <p>No borrowed books.</p>
        )}
      </ul>
    </div>
  );
};

export default BorrowedBooks;
