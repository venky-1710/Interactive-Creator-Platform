
// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/leaderboardService';
import { useAuth } from '../hooks/useAuth';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Find current user's rank
  const userRank = leaderboard.findIndex(entry => user && entry._id === user._id) + 1;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Global Leaderboard</h1>
        <p>Top performers in the Createathon community</p>
      </div>

      {user && userRank > 0 && (
        <div className="user-rank-card">
          <div className="rank-number">#{userRank}</div>
          <div className="user-info">
            <h3>{user.full_name || user.username}</h3>
            <p>{user.points} Points</p>
          </div>
          <Link to="/profile" className="view-profile">View Your Profile</Link>
        </div>
      )}

      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Completed Challenges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr 
                key={entry._id} 
                className={user && entry._id === user._id ? 'current-user' : ''}
              >
                <td className="rank">
                  {index === 0 && <span className="crown">👑</span>}
                  {index + 1}
                </td>
                <td className="user-cell">
                  <div className="avatar">
                    {(entry.full_name || entry.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="username">{entry.username}</span>
                    {entry.full_name && <span className="full-name">{entry.full_name}</span>}
                  </div>
                </td>
                <td className="points">{entry.points}</td>
                <td className="completed">{entry.completed_challenges?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;