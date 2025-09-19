// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengeDetails from './pages/ChallengeDetails';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardMain from './pages/admin/AdminDashboardMain';
import AdminUsers from './pages/admin/AdminUsers';
import AdminChallenges from './pages/admin/AdminChallenges';
import './styles/enhancements.css';

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Admin Routes - Completely separate from user interface */}
            <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminLayout /> : <Navigate to="/login" />}>
              <Route index element={<AdminDashboardMain />} />
              <Route path="analytics" element={<AdminDashboardMain />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/roles" element={<AdminUsers />} />
              <Route path="users/activity" element={<AdminUsers />} />
              <Route path="challenges" element={<AdminChallenges />} />
              <Route path="challenges/create" element={<AdminChallenges />} />
              <Route path="submissions" element={<AdminChallenges />} />
              <Route path="code-execution" element={<AdminChallenges />} />
              <Route path="database" element={<AdminDashboardMain />} />
              <Route path="system-health" element={<AdminDashboardMain />} />
              <Route path="logs" element={<AdminDashboardMain />} />
              <Route path="settings" element={<AdminDashboardMain />} />
              <Route path="activity" element={<AdminDashboardMain />} />
            </Route>
            
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
        {/* Remove the Footer component here */}
      </div>
    </ErrorBoundary>
  );
}

export default App;