// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Shield, 
  LogOut,
  Bell,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3); // Mock notifications

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-brand">
            <Shield className="brand-icon" size={24} />
            <span className="brand-text">Admin Panel</span>
          </div>
        </div>
        
        <div className="admin-header-right">
          <button className="notification-btn">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>
          
          <div className="admin-user-menu">
            <div className="admin-user-info">
              <User className="user-avatar" size={20} />
              <div className="user-details">
                <span className="user-name">{user?.full_name || user?.username}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            
            <div className="admin-actions">
              <button className="admin-action-btn">
                <Settings size={16} />
              </button>
              <button className="admin-action-btn logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="admin-content-wrapper">
        {/* Admin Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className="admin-main-content">
          <div className="admin-page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
