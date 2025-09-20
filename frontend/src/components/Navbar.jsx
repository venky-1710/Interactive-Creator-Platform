import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo-group" onClick={closeMobileMenu}>
            <img
              src={process.env.PUBLIC_URL + '/assets/logo.png'}
              alt="LearnHub logo"
              className="logo-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {user && (
              <Link to="/dashboard" className="nav-link">
                <span>Dashboard</span>
              </Link>
            )}
            <Link to="/challenges" className="nav-link">
              <span>Challenges</span>
            </Link>
            <Link to="/leaderboard" className="nav-link">
              <Trophy className="icon" />
              <span>Leaderboard</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link admin-link">
                <Settings className="icon" />
                <span>Admin Panel</span>
              </Link>
            )}
            {user ? (
              <div className="user-section">
                <Link to="/profile" className="user-profile">
                  <User className="user-icon" />
                  <span className="user-email">{user.email}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="sign-out-btn"
                >
                  <LogOut className="icon" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="sign-in-btn">
                  Sign In
                </Link>
                <Link to="/register" className="sign-up-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'mobile-sidebar-open' : ''}`}>
        <div className="mobile-sidebar-header">
          <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
            <img
              src={process.env.PUBLIC_URL + '/assets/logo.png'}
              alt="LearnHub logo"
              className="mobile-logo-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
          <button 
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {user && (
            <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
              <User className="mobile-nav-icon" />
              <span>Dashboard</span>
            </Link>
          )}
          <Link to="/challenges" className="mobile-nav-link" onClick={closeMobileMenu}>
            <Trophy className="mobile-nav-icon" />
            <span>Challenges</span>
          </Link>
          <Link to="/leaderboard" className="mobile-nav-link" onClick={closeMobileMenu}>
            <Trophy className="mobile-nav-icon" />
            <span>Leaderboard</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="mobile-nav-link admin-mobile-link" onClick={closeMobileMenu}>
              <Settings className="mobile-nav-icon" />
              <span>Admin Panel</span>
            </Link>
          )}
          {user && (
            <Link to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
              <User className="mobile-nav-icon" />
              <span>Profile</span>
            </Link>
          )}
        </div>

        {/* Mobile Auth Section */}
        <div className="mobile-auth-section">
          {user ? (
            <div className="mobile-user-info">
              <div className="mobile-user-email">{user.email}</div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                  closeMobileMenu();
                }}
                className="mobile-sign-out-btn"
              >
                <LogOut className="mobile-nav-icon" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link 
                to="/login" 
                className="mobile-sign-in-btn"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="mobile-sign-up-btn"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
