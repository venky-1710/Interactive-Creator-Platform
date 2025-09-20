// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserSubmissions } from '../services/challengeService';
import ProfileTabs from '../components/ProfileTabs';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsData = await getUserSubmissions();
        
        if (Array.isArray(submissionsData)) {
          setSubmissions(submissionsData);
        } else {
          setSubmissions([]);
        }
        
        setProfileForm({
          full_name: user.full_name || '',
          email: user.email || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setSubmissions([]);
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

  // Filter submissions based on status
  const filteredSubmissions = submissions.filter(submission => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return submission.status.toLowerCase() === 'completed';
    if (filterStatus === 'failed') return submission.status.toLowerCase() === 'failed';
    return true;
  });

  // Navigation handlers
  const handleBrowseChallenges = () => {
    // Navigate to challenges page
    navigate('/challenges');
  };

  const handleViewSubmissionDetails = (submission) => {
    // Navigate to challenge details with submission info
    navigate(`/challenges/${submission.challenge_id}`);
  };

  const handleViewSubmissionCode = (submission) => {
    // Show submission code in a modal or new page
    if (submission.code) {
      // Create a simple modal-like display
      const codeWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      codeWindow.document.write(`
        <html>
          <head>
            <title>Submission Code - ${submission.challenge_name}</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; background: #f5f5f5; }
              .header { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .code { background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; overflow: auto; white-space: pre-wrap; }
              .info { color: #666; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${submission.challenge_name}</h2>
              <div class="info">Language: ${submission.language}</div>
              <div class="info">Status: ${submission.status}</div>
              <div class="info">Points: ${submission.points}</div>
              <div class="info">Submitted: ${new Date(submission.submitted_at).toLocaleString()}</div>
            </div>
            <div class="code">${submission.code}</div>
          </body>
        </html>
      `);
    } else {
      alert('Code not available for this submission');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <div className="loading-content">
            <h3 className="loading-title">Loading Profile</h3>
            <p className="loading-text">Fetching your latest achievements and submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Compute statistics
  const completedChallenges = submissions.filter(s => s.status === 'Completed').length;
  const totalAttempts = submissions.length;
  const successRate = totalAttempts > 0 
    ? ((completedChallenges / totalAttempts) * 100).toFixed(1) 
    : 0;

  const profileContent = (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{user.full_name || user.username}</h1>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-badges">
            <span className="badge badge-primary">{user.points} Points</span>
            <span className="badge badge-success">{user.completed_challenges.length} Completed</span>
          </div>
        </div>
        <div className="profile-actions">
          {!editing && (
            <button 
              className="btn-edit"
              onClick={() => setEditing(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="profile-card">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3 className="form-title">Edit Profile Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="full_name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profileForm.full_name}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled
                  placeholder="Email address"
                />
                <small className="form-hint">Email cannot be changed for security reasons</small>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setEditing(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-details">
          <div className="profile-card">
            <h3 className="card-title">Profile Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="info-content">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">{user.full_name || 'Not provided'}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="info-content">
                  <div className="info-label">Email Address</div>
                  <div className="info-value">{user.email}</div>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="info-content">
                  <div className="info-label">Member Since</div>
                  <div className="info-value">{new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const statsContent = (
    <div className="stats-section">
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-header">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <div className="stat-trend">
                <span className="trend-up">+12%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{user.points.toLocaleString()}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-header">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div className="stat-trend">
                <span className="trend-up">+{completedChallenges}</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{completedChallenges}</div>
              <div className="stat-label">Completed Challenges</div>
            </div>
          </div>

          <div className="stat-card stat-card-info">
            <div className="stat-header">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                  <rect x="9" y="7" width="6" height="4"/>
                </svg>
              </div>
              <div className="stat-trend">
                <span className="trend-neutral">{totalAttempts}</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalAttempts}</div>
              <div className="stat-label">Total Attempts</div>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-header">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                </svg>
              </div>
              <div className="stat-trend">
                <span className="trend-up">{successRate}%</span>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-card">
          <div className="progress-header">
            <h3 className="progress-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
              Learning Progress
            </h3>
            <div className="progress-actions">
              <button 
                className="btn-icon" 
                title="View Detailed Analytics"
                onClick={() => alert('Detailed analytics feature coming soon!')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                  <polyline points="17,6 23,6 23,12"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="progress-content">
            <div className="progress-stats">
              <div className="progress-stat">
                <span className="progress-stat-value">{completedChallenges}</span>
                <span className="progress-stat-label">Completed</span>
              </div>
              <div className="progress-stat">
                <span className="progress-stat-value">{totalAttempts - completedChallenges}</span>
                <span className="progress-stat-label">In Progress</span>
              </div>
              <div className="progress-stat">
                <span className="progress-stat-value">{Math.max(0, 20 - totalAttempts)}</span>
                <span className="progress-stat-label">Remaining</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (completedChallenges / 20) * 100)}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{Math.round((completedChallenges / 20) * 100)}% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const submissionsContent = (
    <div className="submissions-section">
      {submissions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3 className="empty-state-title">No Submissions Yet</h3>
            <p className="empty-state-description">
              You haven't submitted any solutions yet. Start by exploring challenges and submitting your first solution!
            </p>
            <button className="btn-primary empty-state-action" onClick={handleBrowseChallenges}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              Browse Challenges
            </button>
          </div>
        </div>
      ) : (
        <div className="submissions-container">
          <div className="submissions-header">
            <h3 className="submissions-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Submission History ({filteredSubmissions.length})
            </h3>
            <div className="submissions-filters">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('failed')}
              >
                Failed
              </button>
            </div>
          </div>
          
          <div className="submissions-table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Status</th>
                  <th>Points</th>
                  <th>Date</th>
                  <th>Language</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(submission => (
                  <tr key={submission.id} className="submission-row">
                    <td className="challenge-cell">
                      <div className="challenge-info">
                        <div className="challenge-name">{submission.challenge_name}</div>
                        <div className="challenge-difficulty">
                          <span className={`difficulty-badge difficulty-${(submission.difficulty || 'medium').toLowerCase()}`}>
                            {submission.difficulty || 'Medium'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${submission.status.toLowerCase().replace(' ', '-')}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          {submission.status === 'Completed' ? (
                            <polyline points="20,6 9,17 4,12"/>
                          ) : (
                            <circle cx="12" cy="12" r="10"/>
                          )}
                        </svg>
                        {submission.status}
                      </span>
                    </td>
                    <td className="points-cell">
                      <div className="points-display">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                        <span className="points-value">{submission.points}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="date-info">
                        <div className="date-primary">{new Date(submission.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</div>
                        <div className="date-secondary">{new Date(submission.submitted_at).toLocaleDateString('en-US', {
                          year: 'numeric'
                        })}</div>
                      </div>
                    </td>
                    <td className="language-cell">
                      <span className={`language-tag language-${submission.language.toLowerCase()}`}>
                        {submission.language}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          title="View Details"
                          onClick={() => handleViewSubmissionDetails(submission)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          title="View Code"
                          onClick={() => handleViewSubmissionCode(submission)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="16,18 22,12 16,6"/>
                            <polyline points="8,6 2,12 8,18"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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