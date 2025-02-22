// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserSubmissions } from '../services/challengeService';
import ProfileTabs from '../components/ProfileTabs';
import './Profile.css';

function Profile() {
  const { user, updateUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsData = await getUserSubmissions();
        setSubmissions(submissionsData);
        
        setProfileForm({
          full_name: user.full_name || '',
          email: user.email || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // This would normally involve an API call
    updateUser(profileForm);
    setEditing(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  // Compute statistics
  const completedChallenges = submissions.filter(s => s.status === 'Completed').length;
  const totalAttempts = submissions.length;
  const successRate = totalAttempts > 0 
    ? ((completedChallenges / totalAttempts) * 100).toFixed(1) 
    : 0;

  const profileContent = (
    <div className="profile-section">
      {editing ? (
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profileForm.full_name}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              disabled
            />
            <small>Email cannot be changed</small>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-row">
            <strong>Username:</strong>
            <span>{user.username}</span>
          </div>
          <div className="info-row">
            <strong>Full Name:</strong>
            <span>{user.full_name || 'Not provided'}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <strong>Account Created:</strong>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <strong>Points:</strong>
            <span>{user.points}</span>
          </div>
          <div className="info-row">
            <strong>Completed Challenges:</strong>
            <span>{user.completed_challenges.length}</span>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );

  const statsContent = (
    <div className="stats-section">
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Points</h3>
          <p className="stat-value">{user.points}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Challenges</h3>
          <p className="stat-value">{completedChallenges}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p className="stat-value">{totalAttempts}</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">{successRate}%</p>
        </div>
      </div>
      
      <div className="progress-chart">
        <h3>Learning Progress</h3>
        {/* This would be a chart showing progress over time */}
        <div className="placeholder-chart">
          Progress chart visualization would go here
        </div>
      </div>
    </div>
  );

  const submissionsContent = (
    <div className="submissions-section">
      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>You haven't submitted any solutions yet.</p>
        </div>
      ) : (
        <div className="submissions-list">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Status</th>
                <th>Points</th>
                <th>Submitted</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(submission => (
                <tr key={submission.id}>
                  <td>{submission.challenge_name}</td>
                  <td>{submission.status}</td>
                  <td>{submission.points}</td>
                  <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                  <td>{submission.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      <ProfileTabs>
        <div label="Profile">
          {profileContent}
        </div>
        <div label="Statistics">
          {statsContent}
        </div>
        <div label="Submissions">
          {submissionsContent}
        </div>
      </ProfileTabs>
    </div>
  );
}

export default Profile;