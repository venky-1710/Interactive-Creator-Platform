import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Brain, Trophy } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16 animate-fade-in">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900 animate-slide-up">
          Master Coding Through
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 ml-2">
            Interactive Challenges
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Join our community of learners and improve your skills through hands-on coding challenges,
          real-time feedback, and competitive learning.
        </p>
        <Link
          to="/challenges"
          className="btn-primary inline-flex items-center animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          Start Learning <ArrowRight className="ml-2 h-5 w-5 animate-bounce-slow" />
        </Link>
      </section>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="card p-8 animate-scale" style={{ animationDelay: '0.3s' }}>
          <Code className="h-12 w-12 text-indigo-600 mb-4 animate-bounce-slow" />
          <h3 className="text-xl font-semibold mb-2">Interactive Challenges</h3>
          <p className="text-gray-600">
            Practice with real-world coding challenges and get instant feedback on your solutions.
          </p>
        </div>

        <div className="card p-8 animate-scale" style={{ animationDelay: '0.4s' }}>
          <Brain className="h-12 w-12 text-indigo-600 mb-4 animate-bounce-slow" />
          <h3 className="text-xl font-semibold mb-2">Learn by Doing</h3>
          <p className="text-gray-600">
            Hands-on experience with progressive difficulty levels to match your growth.
          </p>
        </div>

        <div className="card p-8 animate-scale" style={{ animationDelay: '0.5s' }}>
          <Trophy className="h-12 w-12 text-indigo-600 mb-4 animate-bounce-slow" />
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Monitor your learning journey with achievements and performance analytics.
          </p>
        </div>
      </div>

      <section className="glass-effect rounded-2xl shadow-xl p-10 mt-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Challenges</h2>
        <div className="grid md:grid-cols-2 gap-8">
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
            <div key={index} className="card p-6 hover:border-indigo-500 border-2 border-transparent animate-hover">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{challenge.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  challenge.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                  {challenge.points} points
                </span>
                <Link
                  to={`/challenges/${index + 1}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium group flex items-center"
                >
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