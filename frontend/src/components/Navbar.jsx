import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            SmartLib
          </Link>
          
          <ul className="navbar-nav">
            {user.is_admin ? (
              <>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/user">User View</Link></li>
              </>
            ) : (
              <li><Link to="/user">Dashboard</Link></li>
            )}
            <li>
              <button 
                className="btn btn-secondary" 
                onClick={handleLogout}
                style={{ padding: '5px 15px', fontSize: '14px' }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
