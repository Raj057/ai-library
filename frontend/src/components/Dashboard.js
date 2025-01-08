import React from 'react';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <div>You are not authorized to access this page.</div>;
  }

  return (
    <div>
      <h1>Welcome to the dashboard!</h1>
      <p>This is a protected page that only authenticated users can access.</p>
    </div>
  );
};

export default Dashboard;