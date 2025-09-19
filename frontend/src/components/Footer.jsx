import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="space-y-4">
            <Link to="/" className="footer-brand">
              <img
                src={process.env.PUBLIC_URL + '/assets/logo.png'}
                alt="LearnHub logo"
                className="footer-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>
            <p className="footer-description">
              Empowering developers through interactive learning and community engagement.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="footer-social-link">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-section-title">Learn</h3>
            <ul className="footer-links">
              <li>
                <Link to="/challenges" className="footer-link">
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="footer-link">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/resources" className="footer-link">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-section-title">Community</h3>
            <ul className="footer-links">
              <li>
                <Link to="/leaderboard" className="footer-link">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="footer-link">
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-section-title">Newsletter</h3>
            <p className="footer-newsletter">
              Stay updated with the latest challenges and community news.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input"
              />
              <button
                type="submit"
                className="footer-button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2024 LearnHub. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-link">
              Terms of Service
            </Link>
            <Link to="/contact" className="footer-link">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
