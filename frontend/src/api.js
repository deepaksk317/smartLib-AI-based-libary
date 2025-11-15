import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Books API
export const booksAPI = {
  getBooks: (skip = 0, limit = 100) => api.get(`/books?skip=${skip}&limit=${limit}`),
  getBook: (id) => api.get(`/books/${id}`),
  searchBooks: (query, genre = null) => {
    const params = new URLSearchParams({ query });
    if (genre) params.append('genre', genre);
    return api.get(`/books/search?${params}`);
  },
  createBook: (bookData) => api.post('/admin/books', bookData),
  updateBook: (id, bookData) => api.put(`/admin/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/admin/books/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

// Book Issue API
export const bookIssueAPI = {
  issueBook: (bookId, issueData) => api.post(`/books/${bookId}/issue`, issueData),
  returnBook: (issueId) => api.post(`/books/return/${issueId}`),
  getMyBooks: () => api.get('/my-books'),
  getAllBookIssues: (skip = 0, limit = 100) => api.get(`/admin/book-issues?skip=${skip}&limit=${limit}`),
};

export default api;
