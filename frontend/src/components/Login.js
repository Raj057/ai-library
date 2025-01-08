import React, { useState } from 'react';
import { backend } from '../lib/path';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${backend}/api/students/login`, { // Adjusted endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, password }), // Updated to match backend
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'student');
        window.location.href = '/dashboard'; // Redirect after login
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error)
      setError('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Student ID:</label>
      <input
        type="text"
        value={studentId}
        onChange={(event) => setStudentId(event.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
