import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated imports
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import BorrowedBooks from './components/BorrowedBooks';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import ChatInterface from './components/ChatInterface';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-list" element={<BookList />} />
          <Route path= "/chatinterface" element={<ChatInterface />} />
          <Route path="/borrowed-books" element={<BorrowedBooks />} />
          <Route path="/add-book" element={<AddBook />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
