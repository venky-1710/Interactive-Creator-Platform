// src/pages/admin/AdminDashboardMain.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { getPlatformStats, getAllUsers, getAllChallenges, getAllSubmissions } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminDashboardMain.css';

const AdminDashboardMain = () => {
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, challengesData, submissionsData] = await Promise.all([
        getPlatformStats(),
        getAllUsers(0, 10),
        getAllChallenges(0, 10),
        getAllSubmissions(0, 20)
      ]);
      
      setStats(statsData);
      setRecentUsers(usersData);
      setRecentChallenges(challengesData);
      setRecentSubmissions(submissionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGrowthPercentage = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-dashboard-main">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <BarChart3 className="page-icon" />
            Admin Dashboard
          </h1>
          <p>Platform overview and key metrics</p>
        </div>
        <div className="header-right">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <Users size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.total_users || 0}</h3>
            <p>Total Users</p>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +12.5% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <CheckCircle size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.active_users || 0}</h3>
            <p>Active Users</p>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +8.3% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">
            <BookOpen size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.total_challenges || 0}</h3>
            <p>Total Challenges</p>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +5.2% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <FileText size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.total_submissions || 0}</h3>
            <p>Total Submissions</p>
            <div className="metric-change positive">
              <TrendingUp size={14} />
              +18.7% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card accent">
          <div className="metric-icon">
            <Target size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.success_rate?.toFixed(1) || 0}%</h3>
            <p>Success Rate</p>
            <div className="metric-change neutral">
              <Activity size={14} />
              -2.1% vs last period
            </div>
          </div>
        </div>

        <div className="metric-card danger">
          <div className="metric-icon">
            <Zap size={28} />
          </div>
          <div className="metric-content">
            <h3>{stats.admin_users || 0}</h3>
            <p>Admin Users</p>
            <div className="metric-change neutral">
              <Globe size={14} />
              No change
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Activity size={20} />
              Recent Activity
            </h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentSubmissions.slice(0, 8).map((submission, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${submission.status.toLowerCase()}`}>
                  {submission.status === 'Completed' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-title">
                    Code submission {submission.status.toLowerCase()}
                  </p>
                  <p className="activity-description">
                    Challenge: {submission.challenge_id} • Language: {submission.language}
                  </p>
                  <span className="activity-time">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Users size={20} />
              Recent Users
            </h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="users-list">
            {recentUsers.map((user) => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <p className="user-name">{user.username}</p>
                  <p className="user-email">{user.email}</p>
                  <div className="user-meta">
                    <span className={`user-role ${user.role}`}>{user.role}</span>
                    <span className="user-points">{user.points} pts</span>
                  </div>
                </div>
                <div className="user-status">
                  <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Statistics */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <BookOpen size={20} />
              Challenge Statistics
            </h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="challenge-stats">
            <div className="stat-row">
              <span className="stat-label">Easy Challenges</span>
              <span className="stat-value">{recentChallenges.filter(c => c.difficulty.toLowerCase() === 'easy').length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Medium Challenges</span>
              <span className="stat-value">{recentChallenges.filter(c => c.difficulty.toLowerCase() === 'medium').length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Hard Challenges</span>
              <span className="stat-value">{recentChallenges.filter(c => c.difficulty.toLowerCase() === 'hard').length}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-row">
              <span className="stat-label">Avg. Points per Challenge</span>
              <span className="stat-value">
                {recentChallenges.length > 0 
                  ? Math.round(recentChallenges.reduce((sum, c) => sum + c.points, 0) / recentChallenges.length)
                  : 0}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Most Popular Category</span>
              <span className="stat-value">Algorithms</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Activity size={20} />
              System Health
            </h3>
            <button className="view-all-btn">Details</button>
          </div>
          <div className="health-metrics">
            <div className="health-item">
              <div className="health-indicator good"></div>
              <div className="health-info">
                <p className="health-label">Database</p>
                <p className="health-status">Operational</p>
              </div>
              <div className="health-value">98.5%</div>
            </div>
            <div className="health-item">
              <div className="health-indicator good"></div>
              <div className="health-info">
                <p className="health-label">API Response</p>
                <p className="health-status">Fast</p>
              </div>
              <div className="health-value">120ms</div>
            </div>
            <div className="health-item">
              <div className="health-indicator warning"></div>
              <div className="health-info">
                <p className="health-label">Code Execution</p>
                <p className="health-status">Moderate Load</p>
              </div>
              <div className="health-value">2.3s</div>
            </div>
            <div className="health-item">
              <div className="health-indicator good"></div>
              <div className="health-info">
                <p className="health-label">Storage</p>
                <p className="health-status">Available</p>
              </div>
              <div className="health-value">76% Free</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Zap size={20} />
              Quick Actions
            </h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn primary">
              <Users size={18} />
              Add New User
            </button>
            <button className="quick-action-btn secondary">
              <BookOpen size={18} />
              Create Challenge
            </button>
            <button className="quick-action-btn accent">
              <FileText size={18} />
              Export Data
            </button>
            <button className="quick-action-btn warning">
              <AlertCircle size={18} />
              System Backup
            </button>
          </div>
        </div>

        {/* Platform Insights */}
        <div className="dashboard-section span-2">
          <div className="section-header">
            <h3>
              <BarChart3 size={20} />
              Platform Insights
            </h3>
            <div className="insight-filters">
              <button className="filter-btn active">Daily</button>
              <button className="filter-btn">Weekly</button>
              <button className="filter-btn">Monthly</button>
            </div>
          </div>
          <div className="insights-content">
            <div className="insight-item">
              <div className="insight-chart">
                <div className="chart-placeholder">
                  <BarChart3 size={48} />
                  <p>Chart visualization would go here</p>
                </div>
              </div>
              <div className="insight-summary">
                <h4>User Engagement Trends</h4>
                <p>User activity has increased by 23% this week, with peak hours between 2-4 PM. Challenge completion rates are highest on weekdays.</p>
                <div className="insight-metrics">
                  <div className="metric">
                    <span className="metric-label">Peak Users</span>
                    <span className="metric-value">1,247</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Avg. Session</span>
                    <span className="metric-value">24 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
