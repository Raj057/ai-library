import React, { useEffect, useState } from 'react';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import ChatInterface from './components/ChatInterface';

function App() {
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    // Fetch available books from the backend
    const fetchAvailableBooks = async () => {
      try {
        const response = await fetch('/api/availableBooks'); // Adjust the API endpoint as needed
        const data = await response.json();
        setAvailableBooks(data);
      } catch (error) {
        console.error('Error fetching available books:', error);
      }
    };

    fetchAvailableBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-4xl font-bold">Library Management System</h1>
        <p className="text-lg mt-2">Powered by AI for easy library access</p>
      </header>
      
      <main className="container mx-auto p-6 space-y-8">
        {/* Chat interface */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Ask the Library System</h2>
          <ChatInterface userType="student" studentId="21ad001" />
        </section>
        
        {/* Add Book Component */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Add a New Book</h2>
          <AddBook />
        </section>
        
        {/* List of available books */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Books Available in the Library</h2>
          <BookList books={availableBooks} />
        </section>
      </main>
    </div>
  );
}

export default App;