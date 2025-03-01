import React, { useState } from 'react';
import { backend } from '../lib/path';

const AdminLogin = () => {
  const [admin_id, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${backend}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: admin_id, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Admin ID:</label>
      <input type="text" value={admin_id} onChange={(event) => setAdminId(event.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <br />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AdminLogin;