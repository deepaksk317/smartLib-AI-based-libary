import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="text-center py-20 animate-fadeIn">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 mb-6">
            SmartLib
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Your intelligent library management system with AI-powered assistance for discovering, 
            borrowing, and managing books with ease
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-2 max-w-4xl mx-auto mb-16">
          <div className="card hover-lift animate-slideIn" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="card-title text-center">For Users</h3>
              <p className="card-subtitle text-center">
                Browse our extensive collection of books, search by genre or author, 
                and get personalized recommendations from our AI assistant.
              </p>
            </div>
            <div className="card-body text-center">
              <Link to="/login" className="btn btn-primary btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                User Login
              </Link>
            </div>
          </div>
          
          <div className="card hover-lift animate-slideIn" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="card-title text-center">For Administrators</h3>
              <p className="card-subtitle text-center">
                Manage your library collection, add new books, update information, 
                and monitor the system with our comprehensive admin dashboard.
              </p>
            </div>
            <div className="card-body text-center">
              <Link to="/login" className="btn btn-success btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-3 max-w-6xl mx-auto mb-16">
          <div className="text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-secondary-800 mb-2">Smart Search</h4>
            <p className="text-sm text-secondary-600">Find books quickly with our intelligent search system</p>
          </div>
          
          <div className="text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-semibold text-secondary-800 mb-2">AI Assistant</h4>
            <p className="text-sm text-secondary-600">Get personalized book recommendations from our AI</p>
          </div>
          
          <div className="text-center animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-secondary-800 mb-2">Easy Management</h4>
            <p className="text-sm text-secondary-600">Track your borrowed books and due dates effortlessly</p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="card max-w-md mx-auto">
            <div className="card-body text-center">
              <h3 className="card-title mb-4">Ready to get started?</h3>
              <p className="card-subtitle mb-6">
                Don't have an account yet? Create one now and start exploring our library!
              </p>
              <Link to="/register" className="btn btn-outline btn-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
