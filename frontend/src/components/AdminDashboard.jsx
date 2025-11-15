import React, { useState, useEffect } from 'react';
import { booksAPI, bookIssueAPI } from '../api';
import BookList from './BookList';
import BookSearch from './BookSearch';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [bookIssues, setBookIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    publication_year: '',
    available_copies: 1,
    total_copies: 1
  });

  useEffect(() => {
    fetchBooks();
    fetchBookIssues();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBooks();
      setBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookIssues = async () => {
    try {
      const response = await bookIssueAPI.getAllBookIssues();
      setBookIssues(response.data);
    } catch (error) {
      console.error('Failed to fetch book issues:', error);
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
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      genre: '',
      publication_year: '',
      available_copies: 1,
      total_copies: 1
    });
    setShowAddForm(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      description: book.description || '',
      genre: book.genre || '',
      publication_year: book.publication_year || '',
      available_copies: book.available_copies,
      total_copies: book.total_copies
    });
    setShowAddForm(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.deleteBook(bookId);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookData = {
        ...formData,
        publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
        available_copies: parseInt(formData.available_copies),
        total_copies: parseInt(formData.total_copies)
      };

      if (editingBook) {
        await booksAPI.updateBook(editingBook.id, bookData);
        toast.success('Book updated successfully');
      } else {
        await booksAPI.createBook(bookData);
        toast.success('Book added successfully');
      }
      
      setShowAddForm(false);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save book');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading && books.length === 0) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={handleAddBook}>
          Add New Book
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('books')}
        >
          Manage Books
        </button>
        <button
          className={`btn ${activeTab === 'issues' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('issues')}
        >
          Book Issues
        </button>
      </div>

      {activeTab === 'books' && (
        <>
          <BookSearch onSearch={handleSearch} loading={loading} />
        </>
      )}

      {activeTab === 'issues' && (
        <div className="card">
          <h3>Book Issues</h3>
          {bookIssues.length === 0 ? (
            <p>No book issues found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookIssues.map((issue) => (
                    <tr key={issue.id}>
                      <td>{issue.user?.username}</td>
                      <td>{issue.book?.title}</td>
                      <td>{issue.book?.author}</td>
                      <td>{new Date(issue.issue_date).toLocaleDateString()}</td>
                      <td>{new Date(issue.due_date).toLocaleDateString()}</td>
                      <td>{issue.return_date ? new Date(issue.return_date).toLocaleDateString() : '-'}</td>
                      <td>
                        <span className={`badge ${
                          issue.status === 'returned' ? 'badge-success' : 
                          new Date(issue.due_date) < new Date() ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {issue.status === 'returned' ? 'Returned' : 
                           new Date(issue.due_date) < new Date() ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  className="form-control"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  className="form-control"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="publication_year">Publication Year</label>
                <input
                  type="number"
                  id="publication_year"
                  name="publication_year"
                  className="form-control"
                  value={formData.publication_year}
                  onChange={handleChange}
                  min="1000"
                  max="2024"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="total_copies">Total Copies *</label>
                <input
                  type="number"
                  id="total_copies"
                  name="total_copies"
                  className="form-control"
                  value={formData.total_copies}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="available_copies">Available Copies *</label>
                <input
                  type="number"
                  id="available_copies"
                  name="available_copies"
                  className="form-control"
                  value={formData.available_copies}
                  onChange={handleChange}
                  required
                  min="0"
                  max={formData.total_copies}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'books' && (
        <BookList
          books={books}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          showAdminActions={true}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
