import React from 'react';

const BookList = ({ books, onEdit, onDelete, showAdminActions = false }) => {
  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="empty-state-title">No books found</h3>
        <p className="empty-state-description">
          Try adjusting your search criteria or browse all available books.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {books.map((book, index) => (
        <div 
          key={book.id} 
          className="card hover-lift animate-fadeIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Book Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-800 mb-2 line-clamp-2">
                {book.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-secondary-600">{book.author}</span>
              </div>
            </div>
            <div className="ml-4">
              {book.available_copies > 0 ? (
                <span className="badge badge-success">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Available
                </span>
              ) : (
                <span className="badge badge-error">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Unavailable
                </span>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-2 mb-4">
            {book.genre && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm text-secondary-600">{book.genre}</span>
              </div>
            )}
            
            {book.publication_year && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-secondary-600">{book.publication_year}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm text-secondary-600">
                {book.available_copies} / {book.total_copies} copies
              </span>
            </div>
          </div>

          {/* Book Description */}
          {book.description && (
            <div className="mb-4">
              <p className="text-sm text-secondary-600 line-clamp-3">
                {book.description.length > 120 
                  ? `${book.description.substring(0, 120)}...` 
                  : book.description
                }
              </p>
            </div>
          )}

          {/* ISBN */}
          {book.isbn && (
            <div className="mb-4 p-2 bg-secondary-50 rounded-lg">
              <span className="text-xs text-secondary-500 font-mono">
                ISBN: {book.isbn}
              </span>
            </div>
          )}
          
          {/* Admin Actions */}
          {showAdminActions && (
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-sm flex-1"
                onClick={() => onEdit(book)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm flex-1"
                onClick={() => onDelete(book.id)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList;
