// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Settings,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  getPlatformStats, 
  getAllUsers, 
  getAllChallenges, 
  getAllSubmissions,
  updateUserRole, 
  updateUserStatus, 
  deleteUser,
  deleteChallenge 
} from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    loadInitialData();
  }, [isAdmin]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, challengesData] = await Promise.all([
        getPlatformStats(),
        getAllUsers(0, 50),
        getAllChallenges(0, 50)
      ]);
      
      setStats(statsData);
      setUsers(usersData);
      setChallenges(challengesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const submissionsData = await getAllSubmissions(0, 100);
      setSubmissions(submissionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: newStatus } : u
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChallengeDelete = async (challengeId) => {
    if (!window.confirm('Are you sure you want to delete this challenge and all related submissions?')) return;
    
    try {
      await deleteChallenge(challengeId);
      setChallenges(challenges.filter(c => c.id !== challengeId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <Shield size={64} />
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <Users className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.total_users}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <UserCheck className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.active_users}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <Shield className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.admin_users}</h3>
            <p>Admin Users</p>
          </div>
        </div>
        <div className="stat-card">
          <BookOpen className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.total_challenges}</h3>
            <p>Total Challenges</p>
          </div>
        </div>
        <div className="stat-card">
          <FileText className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.total_submissions}</h3>
            <p>Total Submissions</p>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div className="stat-content">
            <h3>{stats.success_rate?.toFixed(1)}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <h3>User Management</h3>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleUserRoleUpdate(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{user.points}</td>
                <td className="actions">
                  <button
                    onClick={() => handleUserStatusUpdate(user.id, !user.is_active)}
                    className={`btn-icon ${user.is_active ? 'deactivate' : 'activate'}`}
                    title={user.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                  <button
                    onClick={() => handleUserDelete(user.id)}
                    className="btn-icon delete"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="admin-challenges">
      <h3>Challenge Management</h3>
      <div className="challenges-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Points</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map(challenge => (
              <tr key={challenge.id}>
                <td>{challenge.title}</td>
                <td>{challenge.category}</td>
                <td>
                  <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                    {challenge.difficulty}
                  </span>
                </td>
                <td>{challenge.points}</td>
                <td>{new Date(challenge.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="btn-icon view"
                    title="View Challenge"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn-icon edit"
                    title="Edit Challenge"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleChallengeDelete(challenge.id)}
                    className="btn-icon delete"
                    title="Delete Challenge"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubmissions = () => {
    if (submissions.length === 0) {
      loadSubmissions();
    }

    return (
      <div className="admin-submissions">
        <h3>Submission Management</h3>
        <div className="submissions-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Challenge</th>
                <th>Language</th>
                <th>Status</th>
                <th>Points</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(submission => (
                <tr key={submission.id}>
                  <td>{submission.user_id}</td>
                  <td>{submission.challenge_id}</td>
                  <td>{submission.language}</td>
                  <td>
                    <span className={`status ${submission.status.toLowerCase()}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>{submission.points_earned}</td>
                  <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn-icon view"
                      title="View Submission"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.username}!</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} />
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </button>
        <button
          className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          <BookOpen size={20} />
          Challenges
        </button>
        <button
          className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <FileText size={20} />
          Submissions
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'submissions' && renderSubmissions()}
      </div>
    </div>
  );
};

export default AdminDashboard;
