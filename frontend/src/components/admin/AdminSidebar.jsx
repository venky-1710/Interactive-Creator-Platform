// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Settings,
  Database,
  Activity,
  Shield,
  AlertCircle,
  PieChart,
  TrendingUp,
  UserCheck,
  Code,
  Play
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      section: 'Overview',
      items: [
        {
          path: '/admin',
          icon: BarChart3,
          label: 'Dashboard',
          description: 'Overview & Analytics'
        },
        {
          path: '/admin/analytics',
          icon: PieChart,
          label: 'Analytics',
          description: 'Detailed Statistics'
        },
        {
          path: '/admin/activity',
          icon: Activity,
          label: 'Activity Monitor',
          description: 'Real-time Activity'
        }
      ]
    },
    {
      section: 'User Management',
      items: [
        {
          path: '/admin/users',
          icon: Users,
          label: 'All Users',
          description: 'Manage Users'
        },
        {
          path: '/admin/users/roles',
          icon: Shield,
          label: 'Role Management',
          description: 'User Permissions'
        },
        {
          path: '/admin/users/activity',
          icon: UserCheck,
          label: 'User Activity',
          description: 'Login & Engagement'
        }
      ]
    },
    {
      section: 'Content Management',
      items: [
        {
          path: '/admin/challenges',
          icon: BookOpen,
          label: 'Challenges',
          description: 'Manage Challenges'
        },
        {
          path: '/admin/challenges/create',
          icon: Code,
          label: 'Create Challenge',
          description: 'Add New Challenge'
        },
        {
          path: '/admin/submissions',
          icon: FileText,
          label: 'Submissions',
          description: 'Code Submissions'
        },
        {
          path: '/admin/code-execution',
          icon: Play,
          label: 'Code Execution',
          description: 'Execution Logs'
        }
      ]
    },
    {
      section: 'System',
      items: [
        {
          path: '/admin/database',
          icon: Database,
          label: 'Database',
          description: 'DB Management'
        },
        {
          path: '/admin/system-health',
          icon: TrendingUp,
          label: 'System Health',
          description: 'Performance Metrics'
        },
        {
          path: '/admin/logs',
          icon: AlertCircle,
          label: 'System Logs',
          description: 'Error & Activity Logs'
        },
        {
          path: '/admin/settings',
          icon: Settings,
          label: 'Settings',
          description: 'Platform Config'
        }
      ]
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            <h3 className="section-title">{section.section}</h3>
            <nav className="section-nav">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={itemIndex}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-item-content">
                      <Icon className="nav-icon" size={20} />
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
