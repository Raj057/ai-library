import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowedBooks = ({ studentId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/borrowed-books?studentId=${studentId}`);
        setBorrowedBooks(response.data);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, [studentId]);

  return (
    <div>
      <h2>Your Borrowed Books</h2>
      <ul>
        {borrowedBooks.map((borrowedBook) => (
          <li key={borrowedBook._id}>
            {borrowedBook.book_id} - Due on {new Date(borrowedBook.due_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowedBooks;
