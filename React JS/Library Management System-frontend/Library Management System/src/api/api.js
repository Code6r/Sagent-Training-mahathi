import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Books
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const searchBooks = (title) => api.get(`/books/search?title=${title}`);

// Libraries
export const getLibraries = () => api.get('/libraries');
export const getLibrary = (id) => api.get(`/libraries/${id}`);
export const createLibrary = (data) => api.post('/libraries', data);
export const updateLibrary = (id, data) => api.put(`/libraries/${id}`, data);
export const deleteLibrary = (id) => api.delete(`/libraries/${id}`);

// Authors
export const getAuthors = () => api.get('/authors');
export const getAuthor = (id) => api.get(`/authors/${id}`);
export const createAuthor = (data) => api.post('/authors', data);
export const updateAuthor = (id, data) => api.put(`/authors/${id}`, data);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

// Members
export const getMembers = () => api.get('/members');
export const getMember = (id) => api.get(`/members/${id}`);
export const createMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Librarians
export const getLibrarians = () => api.get('/librarians');
export const createLibrarian = (data) => api.post('/librarians', data);
export const updateLibrarian = (id, data) => api.put(`/librarians/${id}`, data);
export const deleteLibrarian = (id) => api.delete(`/librarians/${id}`);

// Book Copies
export const getBookCopies = () => api.get('/book-copies');
export const createBookCopy = (data) => api.post('/book-copies', data);
export const updateBookCopy = (id, data) => api.put(`/book-copies/${id}`, data);
export const deleteBookCopy = (id) => api.delete(`/book-copies/${id}`);

// Catalog Entries
export const getCatalogEntries = () => api.get('/catalog-entries');
export const createCatalogEntry = (data) => api.post('/catalog-entries', data);
export const updateCatalogEntry = (id, data) => api.put(`/catalog-entries/${id}`, data);
export const deleteCatalogEntry = (id) => api.delete(`/catalog-entries/${id}`);

// Borrowing Records
export const getBorrowingRecords = () => api.get('/borrowing-records');
export const createBorrowingRecord = (data) => api.post('/borrowing-records', data);
export const updateBorrowingRecord = (id, data) => api.put(`/borrowing-records/${id}`, data);
export const deleteBorrowingRecord = (id) => api.delete(`/borrowing-records/${id}`);

// Fines
export const getFines = () => api.get('/fines');
export const createFine = (data) => api.post('/fines', data);
export const updateFine = (id, data) => api.put(`/fines/${id}`, data);
export const deleteFine = (id) => api.delete(`/fines/${id}`);

// Requests
export const getRequests = () => api.get('/requests');
export const createRequest = (data) => api.post('/requests', data);
export const updateRequest = (id, data) => api.put(`/requests/${id}`, data);
export const deleteRequest = (id) => api.delete(`/requests/${id}`);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const createNotification = (data) => api.post('/notifications', data);
export const updateNotification = (id, data) => api.put(`/notifications/${id}`, data);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export default api;
