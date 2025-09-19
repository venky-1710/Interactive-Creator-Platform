// src/pages/admin/AdminChallenges.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Copy,
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  getAllChallenges, 
  updateChallenge, 
  deleteChallenge 
} from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ChallengeModal from '../../components/admin/ChallengeModal';
import './AdminChallenges.css';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewChallenge, setPreviewChallenge] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [challengesPerPage] = useState(15);
  const [modalLoading, setModalLoading] = useState(false);

  const categories = ['all', 'algorithms', 'data-structures', 'web-development', 'database', 'system-design', 'mathematics'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const challengeData = await getAllChallenges(0, 200);
      setChallenges(challengeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (challengeData) => {
    setModalLoading(true);
    try {
      const { createChallenge } = await import('../../services/adminService');
      const newChallenge = await createChallenge(challengeData);
      setChallenges([newChallenge, ...challenges]);
      setShowCreateModal(false);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditChallenge = async (challengeData) => {
    setModalLoading(true);
    try {
      const updatedChallenge = await updateChallenge(editingChallenge.id, challengeData);
      setChallenges(challenges.map(c => c.id === editingChallenge.id ? updatedChallenge : c));
      setShowEditModal(false);
      setEditingChallenge(null);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm('Are you sure you want to delete this challenge? This will also delete all related submissions.')) return;
    
    try {
      await deleteChallenge(challengeId);
      setChallenges(challenges.filter(c => c.id !== challengeId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedChallenges.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedChallenges.length} selected challenges? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      for (const challengeId of selectedChallenges) {
        await deleteChallenge(challengeId);
      }
      setChallenges(challenges.filter(c => !selectedChallenges.includes(c.id)));
      setSelectedChallenges([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || challenge.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty.toLowerCase() === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
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

  const paginatedChallenges = sortedChallenges.slice(
    (currentPage - 1) * challengesPerPage,
    currentPage * challengesPerPage
  );

  const totalPages = Math.ceil(sortedChallenges.length / challengesPerPage);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return 'difficulty-medium';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-challenges">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>
            <BookOpen className="page-icon" />
            Challenge Management
          </h1>
          <p>Create, edit, and manage coding challenges</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
          <button className="btn btn-secondary">
            <Upload size={16} />
            Import
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Create Challenge
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{challenges.length}</h3>
            <p>Total Challenges</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon easy">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{challenges.filter(c => c.difficulty.toLowerCase() === 'easy').length}</h3>
            <p>Easy Challenges</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon medium">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{challenges.filter(c => c.difficulty.toLowerCase() === 'medium').length}</h3>
            <p>Medium Challenges</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon hard">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{challenges.filter(c => c.difficulty.toLowerCase() === 'hard').length}</h3>
            <p>Hard Challenges</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search challenges by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          
          <select 
            value={filterDifficulty} 
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
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
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="points-desc">Highest Points</option>
            <option value="points-asc">Lowest Points</option>
            <option value="difficulty-asc">Difficulty: Easy First</option>
            <option value="difficulty-desc">Difficulty: Hard First</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedChallenges.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">
            {selectedChallenges.length} challenges selected
          </span>
          <div className="bulk-buttons">
            <button 
              className="btn btn-sm btn-danger"
              onClick={handleBulkDelete}
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Challenges Grid */}
      <div className="challenges-grid">
        {paginatedChallenges.map(challenge => (
          <div key={challenge.id} className={`challenge-card ${selectedChallenges.includes(challenge.id) ? 'selected' : ''}`}>
            <div className="challenge-header">
              <input
                type="checkbox"
                checked={selectedChallenges.includes(challenge.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedChallenges([...selectedChallenges, challenge.id]);
                  } else {
                    setSelectedChallenges(selectedChallenges.filter(id => id !== challenge.id));
                  }
                }}
                className="challenge-checkbox"
              />
              <div className="challenge-meta">
                <span className={`difficulty-badge ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="category-badge">
                  {challenge.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="challenge-content">
              <h3 className="challenge-title">{challenge.title}</h3>
              <p className="challenge-description">
                {challenge.description.length > 120 
                  ? `${challenge.description.substring(0, 120)}...` 
                  : challenge.description}
              </p>
              
              <div className="challenge-stats">
                <div className="stat">
                  <span className="stat-label">Points:</span>
                  <span className="stat-value">{challenge.points}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Test Cases:</span>
                  <span className="stat-value">{challenge.test_cases?.length || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created:</span>
                  <span className="stat-value">{new Date(challenge.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="challenge-actions">
              <button
                className="action-btn preview"
                title="Preview Challenge"
                onClick={() => {
                  setPreviewChallenge(challenge);
                  setShowPreviewModal(true);
                }}
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                className="action-btn edit"
                title="Edit Challenge"
                onClick={() => {
                  setEditingChallenge(challenge);
                  setShowEditModal(true);
                }}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                className="action-btn test"
                title="Test Challenge"
              >
                <Play size={16} />
                Test
              </button>
              <button
                className="action-btn copy"
                title="Duplicate Challenge"
              >
                <Copy size={16} />
                Copy
              </button>
              <button
                className="action-btn delete"
                title="Delete Challenge"
                onClick={() => handleDeleteChallenge(challenge.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * challengesPerPage) + 1} to {Math.min(currentPage * challengesPerPage, sortedChallenges.length)} of {sortedChallenges.length} challenges
        </div>
        <div className="pagination-controls">
          <button 
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            return page <= totalPages ? (
              <button
                key={page}
                className={`btn btn-sm ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ) : null;
          })}
          <button 
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Challenge Modal */}
      <ChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateChallenge}
        title="Create New Challenge"
        submitText="Create Challenge"
      />

      {/* Edit Challenge Modal */}
      <ChallengeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingChallenge(null);
        }}
        onSubmit={handleEditChallenge}
        challenge={editingChallenge}
        title="Edit Challenge"
        submitText="Update Challenge"
      />
    </div>
  );
};

export default AdminChallenges;
