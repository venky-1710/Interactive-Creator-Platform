
// src/pages/Leaderboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/leaderboardService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import UserProfileModal from '../components/UserProfileModal';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [sortBy, setSortBy] = useState('points');
  const [currentPage, setCurrentPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRank, setSelectedUserRank] = useState(null);
  const { user } = useAuth();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard(timeFilter);
        setLeaderboard(data);
        setRetryCount(0);
      } catch (err) {
        setError('Failed to load leaderboard. Please check your connection and try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter, retryCount]);

  // Filter and sort leaderboard data
  const filteredAndSortedLeaderboard = useMemo(() => {
    let filtered = leaderboard.filter(entry => {
      const username = entry.username?.toLowerCase() || '';
      const fullName = entry.full_name?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      
      return username.includes(search) || fullName.includes(search);
    });

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.points - a.points;
        case 'challenges':
          return (b.completed_challenges?.length || 0) - (a.completed_challenges?.length || 0);
        case 'username':
          return a.username.localeCompare(b.username);
        default:
          return b.points - a.points;
      }
    });

    return filtered;
  }, [leaderboard, searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedLeaderboard.length / ITEMS_PER_PAGE);
  const paginatedLeaderboard = filteredAndSortedLeaderboard.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserClick = (clickedUser) => {
    const rank = filteredAndSortedLeaderboard.findIndex(u => u._id === clickedUser._id) + 1;
    setSelectedUser(clickedUser);
    setSelectedUserRank(rank);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setSelectedUserRank(null);
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <LoadingSpinner size="large" message="Loading leaderboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-state">
          <div className="error-message">{error}</div>
          <button onClick={handleRetry} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Find current user's rank in the full leaderboard
  const userRank = leaderboard.findIndex(entry => user && entry._id === user._id) + 1;

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: '🥇', class: 'gold' };
    if (rank === 2) return { emoji: '🥈', class: 'silver' };
    if (rank === 3) return { emoji: '🥉', class: 'bronze' };
    return null;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-content">
          <h1>🏆 Global Leaderboard</h1>
          <p>Top performers in the Interactive Creator Platform community</p>
        </div>
        
        <div className="leaderboard-stats">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-number">{leaderboard.length}</span>
              <span className="stat-label">Active Players</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-number">{leaderboard.reduce((sum, user) => sum + (user.completed_challenges?.length || 0), 0)}</span>
              <span className="stat-label">Challenges Completed</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-number">{leaderboard.reduce((sum, user) => sum + user.points, 0).toLocaleString()}</span>
              <span className="stat-label">Total Points Earned</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <span className="stat-number">{Math.round(leaderboard.reduce((sum, user) => sum + (user.completed_challenges?.length || 0), 0) / leaderboard.length || 0)}</span>
              <span className="stat-label">Avg. Completions</span>
            </div>
          </div>
        </div>
      </div>

      {user && userRank > 0 && (
        <div className={`user-rank-card ${getRankBadge(userRank) ? getRankBadge(userRank).class : ''}`}>
          <div className="rank-section">
            {getRankBadge(userRank) && <span className="rank-badge">{getRankBadge(userRank).emoji}</span>}
            <div className="rank-number">#{userRank}</div>
          </div>
          <div className="user-info">
            <h3>{user.full_name || user.username}</h3>
            <p>{user.points} Points • {user.completed_challenges?.length || 0} Challenges Completed</p>
          </div>
          <Link to="/profile" className="view-profile">View Your Profile</Link>
        </div>
      )}

      <div className="leaderboard-controls">
        <div className="controls-header">
          <h3>🔍 Filter & Search</h3>
          <div className="results-info">
            Showing {paginatedLeaderboard.length} of {filteredAndSortedLeaderboard.length} players
          </div>
        </div>
        
        <div className="controls-content">
          <div className="controls-row">
            <div className="search-bar">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search by username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all-time">🌟 All Time</option>
              <option value="monthly">📅 This Month</option>
              <option value="weekly">📊 This Week</option>
              <option value="daily">⚡ Today</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="points">⭐ Points</option>
              <option value="challenges">🎯 Challenges</option>
              <option value="username">👤 Name</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedLeaderboard.length === 0 ? (
        <div className="empty-state">
          <div className="empty-animation">
            <div className="empty-icon">🔍</div>
            <div className="empty-particles">
              <span>✨</span>
              <span>⭐</span>
              <span>🌟</span>
            </div>
          </div>
          <h3>No players found</h3>
          <p>Try adjusting your search terms or filter settings</p>
          <div className="empty-suggestions">
            <button onClick={() => setSearchTerm('')} className="suggestion-btn">
              Clear Search
            </button>
            <button onClick={() => setTimeFilter('all-time')} className="suggestion-btn">
              Show All Time
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="leaderboard-table-container">
            <div className="table-header">
              <h3>🏅 Rankings</h3>
              <div className="table-info">
                Click on any player to view detailed stats
              </div>
            </div>
            
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>🏅 Rank</th>
                  <th>👤 Player</th>
                  <th>⭐ Points</th>
                  <th>🎯 Challenges</th>
                  <th>📊 Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaderboard.map((entry, index) => {
                  const actualRank = filteredAndSortedLeaderboard.findIndex(e => e._id === entry._id) + 1;
                  const badge = getRankBadge(actualRank);
                  const successRate = entry.completed_challenges?.length > 0 
                    ? Math.round((entry.completed_challenges.length / (entry.attempted_challenges || entry.completed_challenges.length)) * 100)
                    : 0;
                  
                  return (
                    <tr 
                      key={entry._id} 
                      className={`${user && entry._id === user._id ? 'current-user' : ''} ${badge ? badge.class : ''} clickable-row`}
                      onClick={() => handleUserClick(entry)}
                    >
                      <td className="rank">
                        <div className="rank-display">
                          {badge && <span className="rank-badge">{badge.emoji}</span>}
                          <span className="rank-number">#{actualRank}</span>
                        </div>
                      </td>
                      <td className="user-cell">
                        <div className="avatar">
                          {(entry.full_name || entry.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <span className="username">{entry.username}</span>
                          {entry.full_name && <span className="full-name">{entry.full_name}</span>}
                          {entry.location && <span className="location">📍 {entry.location}</span>}
                        </div>
                      </td>
                      <td className="points">
                        <div className="points-display">
                          <span className="points-value">{entry.points.toLocaleString()}</span>
                          <span className="points-label">pts</span>
                        </div>
                      </td>
                      <td className="completed">
                        <div className="challenges-display">
                          <span className="challenges-count">{entry.completed_challenges?.length || 0}</span>
                          <span className="challenges-label">challenges</span>
                        </div>
                      </td>
                      <td className="success-rate">
                        <div className="success-display">
                          <span className="success-percentage">{successRate}%</span>
                          <div className="success-bar">
                            <div 
                              className="success-fill" 
                              style={{ width: `${successRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          rank={selectedUserRank}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Leaderboard;