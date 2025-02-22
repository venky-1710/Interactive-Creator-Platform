import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo-group">
          <BookOpen className="logo-icon" />
          <span className="logo-text">LearnHub</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/challenges" className="nav-link">
            <span>Challenges</span>
          </Link>
          <Link to="/leaderboard" className="nav-link">
            <Trophy className="icon" />
            <span>Leaderboard</span>
          </Link>
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
  );
};

export default Navbar;
