// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  UserCheck,
  UserX,
  Eye,
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';
import { 
  getAllUsers, 
  updateUserRole, 
  updateUserStatus, 
  deleteUser 
} from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import UserModal from '../../components/admin/UserModal';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers(0, 200); // Load more users for admin
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        (u.id || u._id) === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => 
        (u.id || u._id) === userId ? { ...u, is_active: newStatus } : u
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateUser = async (userData) => {
    setModalLoading(true);
    try {
      const { createUser } = await import('../../services/adminService');
      const newUser = await createUser(userData);
      setUsers([newUser, ...users]);
      setShowCreateModal(false);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    setModalLoading(true);
    try {
      const { updateUser } = await import('../../services/adminService');
      const updatedUser = await updateUser(editingUser.id || editingUser._id, userData);
      setUsers(users.map(u => (u.id || u._id) === (editingUser.id || editingUser._id) ? updatedUser : u));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => (u.id || u._id) !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    const confirmMessage = `Are you sure you want to ${action} ${selectedUsers.length} selected users?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      for (const userId of selectedUsers) {
        switch (action) {
          case 'activate':
            await handleStatusUpdate(userId, true);
            break;
          case 'deactivate':
            await handleStatusUpdate(userId, false);
            break;
          case 'delete':
            await handleDeleteUser(userId);
            break;
          default:
            break;
        }
      }
      setSelectedUsers([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-users">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>
            <Users className="page-icon" />
            User Management
          </h1>
          <p>Manage all platform users, roles, and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Users
          </button>
          <button className="btn btn-secondary">
            <Upload size={16} />
            Import Users
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users by username, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="filter-select"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="username-asc">Username A-Z</option>
            <option value="username-desc">Username Z-A</option>
            <option value="points-desc">Highest Points</option>
            <option value="points-asc">Lowest Points</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedUsers.length} users selected
          </span>
          <div className="bulk-buttons">
            <button 
              className="btn btn-sm btn-success"
              onClick={() => handleBulkAction('activate')}
            >
              <UserCheck size={14} />
              Activate
            </button>
            <button 
              className="btn btn-sm btn-warning"
              onClick={() => handleBulkAction('deactivate')}
            >
              <UserX size={14} />
              Deactivate
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(paginatedUsers.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Points</th>
              <th>Challenges</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id || user._id} className={selectedUsers.includes(user.id || user._id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id || user._id)}
                    onChange={(e) => {
                      const userId = user.id || user._id;
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, userId]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== userId));
                      }
                    }}
                  />
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <span className="username">{user.username}</span>
                      <span className="fullname">{user.full_name || 'No name provided'}</span>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleUpdate(user.id || user._id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="points">{user.points}</td>
                <td className="challenges">{user.completed_challenges?.length || 0}</td>
                <td className="date">{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <button
                      className="action-btn view"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Edit User"
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="action-btn status"
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                      onClick={() => handleStatusUpdate(user.id || user._id, !user.is_active)}
                    >
                      {user.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button
                      className="action-btn role"
                      title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      onClick={() => handleRoleUpdate(user.id || user._id, user.role === 'admin' ? 'user' : 'admin')}
                    >
                      {user.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id || user._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, sortedUsers.length)} of {sortedUsers.length} users
        </div>
        <div className="pagination-controls">
          <button 
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`btn btn-sm ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create User Modal */}
      <UserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        title="Create New User"
        submitText="Create User"
      />

      {/* Edit User Modal */}
      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleEditUser}
        user={editingUser}
        title="Edit User"
        submitText="Update User"
      />
    </div>
  );
};

export default AdminUsers;
