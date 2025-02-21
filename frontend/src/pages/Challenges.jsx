// src/pages/Challenges.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllChallenges } from '../services/challengeService';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: ''
  });

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const activeFilers = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );
        const data = await getAllChallenges(activeFilers);
        setChallenges(data);
      } catch (err) {
        setError('Failed to load challenges. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading challenges...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const categories = ["All", "Python", "JavaScript", "Data Structures", "Algorithms", "Web Development"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h1>Coding Challenges</h1>
        <p>Test your skills and learn new concepts with our challenges</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select 
            id="category" 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category !== "All" ? category : ""}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select 
            id="difficulty" 
            name="difficulty" 
            value={filters.difficulty} 
            onChange={handleFilterChange}
          >
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty !== "All" ? difficulty : ""}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="empty-state">
          <p>No challenges found matching your filters.</p>
          <button 
            className="btn-primary"
            onClick={() => setFilters({ category: '', difficulty: '' })}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="challenges-grid">
          {challenges.map(challenge => (
            <div key={challenge._id} className="challenge-card">
              <div className="challenge-header">
                <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
                <span className="category">{challenge.category}</span>
              </div>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <div className="challenge-footer">
                <span className="points">
                  <i className="icon-star"></i> {challenge.points} points
                </span>
                <Link to={`/challenges/${challenge._id}`} className="btn-primary">
                  View Challenge
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Challenges;