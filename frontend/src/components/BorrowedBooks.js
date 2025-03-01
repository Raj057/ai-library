// Updated BorrowedBooks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend } from '../lib/path';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [bookdata, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (role === 'admin') {
          const resp = await axios.get(`${backend}/api/books/borrowed`);
          setBorrowedBooks(resp.data.borrowed_books);
          console.log(resp.data.borrowed_books);
        }
        const response = await axios.get(`${backend}/api/students/borrowed`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data.student.borrowed_books);
        setBorrowedBooks(response.data.student.borrowed_books);
        setData(response.data.books);
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
      <ul>
        {borrowedBooks.length > 0 && bookdata ? (
          borrowedBooks.map((borrowedBook) => {
            const bookDetails = bookdata.find(book => book.book_id === borrowedBook.book_id);
            return (
              <li key={borrowedBook._id}>
                {"Title:"}{bookDetails ? bookDetails.title : 'Unknown'}, 
                {" Fine:"}{borrowedBook.fine}, 
                {" Days late:"} {borrowedBook.days_left * -1}
              </li>
            );
          })
        ) : (
          <p>No borrowed books.</p>
        )}
      </ul>
    </div>
  );
};

export default BorrowedBooks;