// Updated Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <nav>
      <ul>
        {!token ? (
          <>
            <li>
              <Link to="/login">Student Login</Link>
            </li>
            <li>
              <Link to="/admin/login">Admin Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {role === 'admin' && (
              <li>
                <Link to="/add-book">Add Book</Link>
              </li>
            )}
            <li>
              <Link to="/book-list">Book List</Link>
            </li>
            <li>
              <Link to="/borrowed-books">Borrowed Books</Link>
            </li>
            <li>
              <Link to="/chatinterface">AI Chat</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;