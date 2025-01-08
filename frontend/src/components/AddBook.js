// Updated AddBook.js
import React, { useState } from 'react';
import axios from 'axios';
import { backend } from '../lib/path';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    section: '',
    column: '',
    genre: '',
    total_copies: 1,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backend}/api/books`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Book added successfully');
      setFormData({
        title: '',
        author: '',
        section: '',
        column: '',
        genre: '',
        total_copies: 1,
      });
    } catch (error) {
      setError('Error adding book.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full rounded-lg"
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
        className="border p-2 w-full rounded-lg"
      />
      <input
        type="text"
        name="section"
        value={formData.section}
        onChange={handleChange}
        placeholder="Section"
        className="border p-2 w-full rounded-lg"
      />
      <input
        type="text"
        name="column"
        value={formData.column}
        onChange={handleChange}
        placeholder="Column"
        className="border p-2 w-full rounded-lg"
      />
      <input
        type="text"
        name="genre"
        value={formData.genre}
        onChange={handleChange}
        placeholder="Genre"
        className="border p-2 w-full rounded-lg"
      />
      <input
        type="number"
        name="total_copies"
        value={formData.total_copies}
        onChange={handleChange}
        placeholder="Total Copies"
        className="border p-2 w-full rounded-lg"
        min="1"
      />
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
        Add Book
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default AddBook;