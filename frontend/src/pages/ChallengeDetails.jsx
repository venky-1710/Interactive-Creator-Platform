// src/pages/ChallengeDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getChallengeById, submitChallenge } from '../services/challengeService';
import CodeEditor from '../components/CodeEditor';

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await getChallengeById(id);
        setChallenge(data);
        
        // Set initial code template based on language
        if (data.category.includes('Python')) {
          setLanguage('python');
          setCode('def solution():\n    # Your code here\n    pass\n\n# Write your solution above');
        } else if (data.category.includes('JavaScript')) {
          setLanguage('javascript');
          setCode('function solution() {\n    // Your code here\n    \n}\n\n// Write your solution above');
        } else {
          setLanguage('python');
          setCode('# Write your solution here\n');
        }
      } catch (err) {
        setError('Failed to load challenge. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/challenges/${id}` } });
      return;
    }

    try {
      setSubmitting(true);
      setResult(null);
      
      const submissionData = {
        challenge_id: challenge._id,
        code,
        language
      };
      
      const result = await submitChallenge(submissionData);
      setResult(result);
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading challenge...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!challenge) {
    return <div className="not-found">Challenge not found.</div>;
  }

  return (
    <div className="challenge-details-container">
      <div className="challenge-header">
        <h1>{challenge.title}</h1>
        <div className="challenge-meta">
          <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </span>
          <span className="category">{challenge.category}</span>
          <span className="points">{challenge.points} points</span>
        </div>
      </div>

      <div className="challenge-content">
        <div className="description">
          <h2>Challenge Description</h2>
          <div className="markdown-content">
            {challenge.description}
          </div>
          <div className="instructions">
            <h3>Instructions</h3>
            <div className="markdown-content">
              {challenge.content}
            </div>
          </div>
          
          {challenge.test_cases && challenge.test_cases.length > 0 && (
            <div className="test-cases">
              <h3>Example Test Cases</h3>
              <div className="test-cases-list">
                {challenge.test_cases.slice(0, 3).map((test, index) => (
                  <div key={index} className="test-case">
                    <p><strong>Input:</strong> {test.input}</p>
                    <p><strong>Expected Output:</strong> {test.expected_output}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="code-section">
          <div className="language-selector">
            <label htmlFor="language">Programming Language:</label>
            <select 
              id="language" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              disabled={submitting}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          
          <CodeEditor 
            code={code} 
            onChange={setCode} 
            language={language} 
            disabled={submitting}
          />
          
          <div className="submission-controls">
            <button 
              className="btn-primary submit-btn" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
            <button 
              className="btn-secondary reset-btn"
              onClick={() => setCode('')}
              disabled={submitting}
            >
              Reset Code
            </button>
          </div>
          
          {result && (
            <div className={`submission-result ${result.status.toLowerCase()}`}>
              <h3>Submission Result: {result.status}</h3>
              {result.points_earned > 0 && (
                <p className="points-earned">
                  Congratulations! You earned {result.points_earned} points.
                </p>
              )}
              {result.test_results && (
                <div className="test-results">
                  <h4>Test Results:</h4>
                  <ul>
                    {result.test_results.map((test, index) => (
                      <li key={index} className={test.passed ? 'passed' : 'failed'}>
                        Test Case {test.test_case}: {test.passed ? 'Passed ✓' : 'Failed ✗'}
                        {!test.passed && <p className="error-output">{test.output}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetails;