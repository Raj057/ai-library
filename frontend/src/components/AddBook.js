import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    section: '',
    column: '',
    genre: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books', formData);
      alert('Book added successfully');
      setFormData({
        title: '',
        author: '',
        section: '',
        column: '',
        genre: '',
      });
    } catch (error) {
      console.error('Error adding book:', error);
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
        type="text"
        name="book_id"
        value={formData.book_id}
        onChange={handleChange}
        placeholder="Book ID"
        className="border p-2 w-full rounded-lg"
      />
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
        Add Book
      </button>
    </form>
  );
};

export default AddBook;
