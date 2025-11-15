import React, { useState, useEffect } from 'react';
import { booksAPI } from '../api';
import BookList from './BookList';
import BookSearch from './BookSearch';
import Chatbot from './Chatbot';
import MyBooksPage from '../pages/MyBooksPage';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, genre) => {
    try {
      setLoading(true);
      if (query.trim()) {
        const response = await booksAPI.searchBooks(query, genre || null);
        setBooks(response.data);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && books.length === 0) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-4">
          Welcome to SmartLib
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Your intelligent library management system with AI-powered assistance for discovering and managing books
        </p>
      </div>

      {/* Modern Tab System */}
      <div className="tab-container animate-slideIn">
        <div className="tab-nav">
          <button
            className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Browse Books
          </button>
          <button
            className={`tab-button ${activeTab === 'mybooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('mybooks')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Books
          </button>
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            AI Assistant
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'books' && (
            <div className="animate-fadeIn">
              <BookSearch onSearch={handleSearch} loading={loading} />
              <BookList books={books} showAdminActions={false} />
            </div>
          )}

          {activeTab === 'mybooks' && (
            <div className="animate-fadeIn">
              <MyBooksPage />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="animate-fadeIn">
              <Chatbot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
