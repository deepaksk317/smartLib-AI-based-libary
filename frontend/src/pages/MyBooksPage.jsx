import React, { useState, useEffect } from 'react';
import { bookIssueAPI, booksAPI } from '../api';
import toast from 'react-hot-toast';

const MyBooksPage = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchMyBooks();
    fetchAvailableBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await bookIssueAPI.getMyBooks();
      setMyBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch my books:', error);
      toast.error('Failed to fetch your books');
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const response = await booksAPI.getBooks();
      setAvailableBooks(response.data.filter(book => book.available_copies > 0));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch available books:', error);
      toast.error('Failed to fetch available books');
      setLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      toast.error('Please select a book');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    // Check if due date is in the future
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      toast.error('Due date must be in the future');
      return;
    }

    setIssuing(true);
    try {
      const issueData = {
        due_date: selectedDate.toISOString()
      };
      
      console.log('Issuing book with data:', issueData);
      console.log('Book ID:', selectedBook);
      
      await bookIssueAPI.issueBook(parseInt(selectedBook), issueData);
      
      toast.success('Book issued successfully!');
      setShowIssueForm(false);
      setSelectedBook('');
      setDueDate('');
      fetchMyBooks();
      fetchAvailableBooks();
    } catch (error) {
      console.error('Issue book error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to issue book';
      toast.error(errorMessage);
    } finally {
      setIssuing(false);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      await bookIssueAPI.returnBook(issueId);
      toast.success('Book returned successfully!');
      fetchMyBooks();
      fetchAvailableBooks();
    } catch (error) {
      console.error('Return book error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to return book';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your borrowed books</p>
        </div>
        <button
          onClick={() => setShowIssueForm(!showIssueForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {showIssueForm ? 'Cancel' : 'Issue Book'}
        </button>
      </div>

      {/* Issue Book Form */}
      {showIssueForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Issue a New Book</h2>
              <p className="text-sm text-gray-600">Select a book and set the return date</p>
            </div>
          </div>

          <form onSubmit={handleIssueBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Book *
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">Choose a book to borrow...</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} (Available: {book.available_copies})
                    </option>
                  ))}
                </select>
                {availableBooks.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">No books available for issue</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mt-1 text-xs text-gray-500">Select when you plan to return the book</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowIssueForm(false);
                  setSelectedBook('');
                  setDueDate('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedBook || !dueDate || issuing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center"
              >
                {issuing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Issuing...
                  </>
                ) : (
                  'Issue Book'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Issued Books */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Currently Issued Books</h2>
              <p className="text-sm text-gray-600">Books you have borrowed from the library</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {myBooks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books currently issued</h3>
              <p className="text-gray-500 mb-4">You haven't borrowed any books yet. Click "Issue Book" to get started!</p>
              <button
                onClick={() => setShowIssueForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Issue Your First Book
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myBooks.map((book) => {
                const daysUntilDue = getDaysUntilDue(book.due_date);
                const overdue = isOverdue(book.due_date);
                
                return (
                  <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${
                          overdue ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          <svg className={`w-4 h-4 ${overdue ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{book.book?.title}</h3>
                          <p className="text-gray-600 text-xs">by {book.book?.author}</p>
                          <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                            <span>Issued: {formatDate(book.issue_date)}</span>
                            <span>Due: {formatDate(book.due_date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          overdue 
                            ? 'bg-red-100 text-red-800' 
                            : daysUntilDue <= 3 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {overdue ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Overdue
                            </>
                          ) : daysUntilDue <= 3 ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Due Soon
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Active
                            </>
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleReturnBook(book.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Return
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooksPage;