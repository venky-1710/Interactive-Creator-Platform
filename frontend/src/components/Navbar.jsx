// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Createathon
        </Link>
        <div className="nav-links">
          <Link to="/challenges">Challenges</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <span className="points-badge">{user.points} pts</span>
              <Link to="/profile" className="profile-link">
                <div className="avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="username">{user.username}</span>
              </Link>
            </div>
            <div className="dropdown">
              <button className="dropdown-toggle">
                <i className="icon-menu"></i>
              </button>
              <div className="dropdown-menu">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                <button onClick={logout} className="logout-btn">
                  Log Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-secondary">
              Log In
            </Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;