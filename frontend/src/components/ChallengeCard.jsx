// src/components/ChallengeCard.jsx
import { Link } from 'react-router-dom';

function ChallengeCard({ challenge }) {
  return (
    <div className="challenge-card">
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
  );
}

export default ChallengeCard;