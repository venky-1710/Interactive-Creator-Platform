import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Brain, Trophy } from 'lucide-react';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-section">
        <h1 className="home-heading">
          Master Coding Through 
          <span className="home-heading-span">
            Interactive Challenges
          </span>
        </h1>
        <p className="home-text">
          Join our community of learners and improve your skills through hands-on coding challenges,
          real-time feedback, and competitive learning.
        </p>
        <Link to="/challenges" className="home-link">
          Start Learning <ArrowRight className="ml-2 h-5 w-5 animate-bounce-slow" />
        </Link>
      </section>

      <div className="home-grid">
        <div className="home-card">
          <Code className="home-icon" />
          <h3 className="home-card-title">Interactive Challenges</h3>
          <p className="home-card-text">
            Practice with real-world coding challenges and get instant feedback on your solutions.
          </p>
        </div>

        <div className="home-card">
          <Brain className="home-icon" />
          <h3 className="home-card-title">Learn by Doing</h3>
          <p className="home-card-text">
            Hands-on experience with progressive difficulty levels to match your growth.
          </p>
        </div>

        <div className="home-card">
          <Trophy className="home-icon" />
          <h3 className="home-card-title">Track Progress</h3>
          <p className="home-card-text">
            Monitor your learning journey with achievements and performance analytics.
          </p>
        </div>
      </div>

      <section className="featured-section">
        <h2 className="featured-title">Featured Challenges</h2>
        <div className="featured-grid">
          {[
            {
              title: "Python Basics",
              description: "Learn fundamental Python concepts through practical exercises",
              difficulty: "beginner",
              points: 100
            },
            {
              title: "JavaScript Algorithms",
              description: "Master common algorithmic challenges in JavaScript",
              difficulty: "intermediate",
              points: 200
            }
          ].map((challenge, index) => (
            <div key={index} className="featured-card">
              <div className="featured-card-header">
                <h3 className="featured-card-title">{challenge.title}</h3>
                <span className={`difficulty-badge ${
                  challenge.difficulty === 'beginner' ? 'beginner' : 'intermediate'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="featured-card-text">{challenge.description}</p>
              <div className="featured-card-footer">
                <span className="points-badge">
                  {challenge.points} points
                </span>
                <Link to={`/challenges/${index + 1}`} className="featured-link">
                  Start Challenge
                  <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
