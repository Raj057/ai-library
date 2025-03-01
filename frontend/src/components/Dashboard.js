import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend } from '../lib/path';

const Dashboard = () => {
  const [role] = useState(localStorage.getItem('role')); // Get role from localStorage
  const [data, setData] = useState([]);
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        if (role === 'student') {
          // Fetch borrowed books for the student
          const borrowedBooksResponse = await axios.get(`${backend}/api/students/${userId}/borrowed-books`, config);
          setData(borrowedBooksResponse.data);

          // Fetch total fines for the student
          const finesResponse = await axios.get(`${backend}/api/students/${userId}/pending-fines`, config);
          setTotalFine(finesResponse.data.totalFine);
        } else if (role === 'admin') {
          // Fetch borrowed books and fines for all students
          const adminResponse = await axios.get(`${backend}/api/admin/borrowed-books`, config);
          setData(adminResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {role === 'student' && (
        <div>
          <h2>Your Borrowed Books</h2>
          {data.length > 0 ? (
            <ul>
              {data.map((book) => (
                <li key={book.book_id}>
                  <strong>{book.title}</strong> by {book.author} <br />
                  <span>Due Date: {new Date(book.due_date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not borrowed any books.</p>
          )}

          <h2>Total Fine: ${totalFine}</h2>
        </div>
      )}

      {role === 'admin' && (
        <div>
          <h2>All Borrowed Books</h2>
          {data.length > 0 ? (
            <ul>
              {data.map((record) => (
                <li key={record.book_id}>
                  <strong>{record.title}</strong> by {record.author} <br />
                  Borrowed by: {record.student_name} ({record.student_id}) <br />
                  <span>Due Date: {new Date(record.due_date).toLocaleDateString()}</span>
                  {record.fine > 0 && <p style={{ color: 'red' }}>Fine: ${record.fine}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No books are currently borrowed.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
