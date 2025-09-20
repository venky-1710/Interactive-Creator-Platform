// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserSubmissions } from '../services/challengeService';
import { getChallengeById } from '../services/challengeService';
import Calendar from '../components/Calendar';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    attempted: 0,
    success_rate: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const submissionsData = await getUserSubmissions();
        setSubmissions(submissionsData);
        
        // Track unique challenges and get their details
        const uniqueChallengeIds = [...new Set(submissionsData.map(s => s.challenge_id))];
        const challengesData = {};
        
        for (const id of uniqueChallengeIds) {
          try {
            const challenge = await getChallengeById(id);
            challengesData[id] = challenge;
          } catch (err) {
            console.error(`Failed to fetch challenge ${id}:`, err);
          }
        }
        
        setChallenges(challengesData);
        
        // Calculate stats
        const completed = submissionsData.filter(s => s.status === 'Completed').length;
        const attempted = submissionsData.length;
        const successRate = attempted > 0 ? (completed / attempted) * 100 : 0;
        
        setStats({
          completed,
          attempted,
          success_rate: successRate.toFixed(1)
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.full_name || user.username}!</h1>
        <div className="user-stats">
          <div className="stat-card">
            <h3>Points</h3>
            <p className="stat-value">{user.points}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Success Rate</h3>
            <p className="stat-value">{stats.success_rate}%</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-left">
          <section className="calendar-section">
            <Calendar />
          </section>
        </div>

        <div className="dashboard-right">
          <section className="recent-activity">
            <h2>Recent Activity</h2>
          {submissions.length === 0 ? (
            <div className="empty-state">
              <p>You haven't attempted any challenges yet.</p>
              <Link to="/challenges" className="btn-primary">Find Challenges</Link>
            </div>
          ) : (
            <div className="activity-list">
              {submissions.slice(0, 5).map(submission => (
                <div key={submission._id} className="activity-item">
                  <div className={`status-badge ${submission.status.toLowerCase()}`}>
                    {submission.status}
                  </div>
                  <h3>{challenges[submission.challenge_id]?.title || 'Unknown Challenge'}</h3>
                  <p>Submitted: {new Date(submission.submitted_at).toLocaleString()}</p>
                  <p>Points earned: {submission.points_earned}</p>
                  <Link to={`/challenges/${submission.challenge_id}`} className="btn-secondary">
                    View Challenge
                  </Link>
                </div>
              ))}
              {submissions.length > 5 && (
                <p className="view-all">
                  <Link to="/profile">View all submissions</Link>
                </p>
              )}
            </div>
          )}
        </section>
        
        <section className="recommended-challenges">
          <h2>Recommended Challenges</h2>
          <div className="challenges-grid">
            {/* This would typically be based on user's interests/history */}
            <div className="challenge-card">
              <span className="difficulty beginner">Beginner</span>
              <h3>Python Basics</h3>
              <p>Learn fundamental Python concepts through simple challenges</p>
              <Link to="/challenges/beginner" className="btn-primary">Start Learning</Link>
            </div>
            <div className="challenge-card">
              <span className="difficulty intermediate">Intermediate</span>
              <h3>Data Structures</h3>
              <p>Master essential data structures for efficient programming</p>
              <Link to="/challenges/data-structures" className="btn-primary">Explore Challenges</Link>
            </div>
            <div className="challenge-card">
              <span className="difficulty advanced">Advanced</span>
              <h3>Algorithm Optimization</h3>
              <p>Take your algorithm skills to the next level</p>
              <Link to="/challenges/algorithms" className="btn-primary">Test Your Skills</Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;