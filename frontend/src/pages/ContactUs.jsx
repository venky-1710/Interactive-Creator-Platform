import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageSquare,
  HelpCircle,
  Bug,
  Lightbulb,
  Shield
} from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      value: 'support@praxiscode.com',
      link: 'mailto:support@praxiscode.com',
      responseTime: '24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Available 9 AM - 6 PM EST',
      link: '#',
      responseTime: 'Instant'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Premium users only',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      responseTime: 'Immediate'
    }
  ];

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'General Support',
      description: 'Account, platform usage, general questions'
    },
    {
      icon: Bug,
      title: 'Technical Issues',
      description: 'Bugs, errors, performance problems'
    },
    {
      icon: Lightbulb,
      title: 'Feature Requests',
      description: 'Suggestions for new features or improvements'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Security concerns, privacy questions'
    },
    {
      icon: MessageSquare,
      title: 'Feedback',
      description: 'General feedback about your experience'
    }
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.'
    },
    {
      question: 'Can I change my username?',
      answer: 'Usernames cannot be changed after account creation. If you need a different username, you would need to create a new account.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'You can delete your account from your profile settings. Note that this action is permanent and cannot be undone.'
    },
    {
      question: 'Are the coding challenges free?',
      answer: 'We offer both free and premium challenges. Free users have access to a substantial number of challenges, while premium users get additional content and features.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer refunds within 30 days of purchase if you are not satisfied with our premium features. Please contact support for assistance.'
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-content">
        {/* Header Section */}
        <div className="contact-header">
          <div className="contact-icon">
            <MessageCircle className="h-12 w-12" />
          </div>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            We're here to help! Get in touch with our support team for any questions or assistance.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="contact-methods">
          <h2>Get in Touch</h2>
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">
                  <method.icon className="h-6 w-6" />
                </div>
                <div className="method-content">
                  <h3>{method.title}</h3>
                  <p className="method-description">{method.description}</p>
                  <a href={method.link} className="method-value">
                    {method.value}
                  </a>
                  <span className="response-time">
                    <Clock className="h-4 w-4" />
                    Response: {method.responseTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="form-header">
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>

          {submitStatus && (
            <div className={`submit-status ${submitStatus}`}>
              {submitStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Message sent successfully! We'll get back to you soon.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>There was an error sending your message. Please try again.</span>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <User className="h-4 w-4" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  <HelpCircle className="h-4 w-4" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="general">General Support</option>
                  <option value="technical">Technical Issues</option>
                  <option value="feature">Feature Requests</option>
                  <option value="security">Security & Privacy</option>
                  <option value="feedback">Feedback</option>
                  <option value="billing">Billing & Payments</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">
                  <AlertCircle className="h-4 w-4" />
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                <MessageSquare className="h-4 w-4" />
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                <MessageCircle className="h-4 w-4" />
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                placeholder="Please provide detailed information about your inquiry..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support Categories */}
        <div className="support-categories">
          <h2>What can we help you with?</h2>
          <div className="categories-grid">
            {supportCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">
                  <HelpCircle className="h-5 w-5" />
                  {item.question}
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Office Information */}
        <div className="office-info">
          <h2>Our Office</h2>
          <div className="office-details">
            <div className="office-item">
              <MapPin className="h-5 w-5" />
              <div>
                <h3>Address</h3>
                <p>123 Learning Street<br />Tech District, CA 90210<br />United States</p>
              </div>
            </div>
            <div className="office-item">
              <Clock className="h-5 w-5" />
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST<br />Saturday: 10:00 AM - 4:00 PM EST<br />Sunday: Closed</p>
              </div>
            </div>
            <div className="office-item">
              <Phone className="h-5 w-5" />
              <div>
                <h3>Phone Support</h3>
                <p>Premium users: +1 (555) 123-4567<br />Available during business hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="additional-resources">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Help Center</h3>
              <p>Browse our comprehensive help documentation and tutorials.</p>
              <a href="#" className="resource-link">Visit Help Center</a>
            </div>
            <div className="resource-card">
              <h3>Community Forum</h3>
              <p>Connect with other learners and get answers from the community.</p>
              <a href="#" className="resource-link">Join Forum</a>
            </div>
            <div className="resource-card">
              <h3>Status Page</h3>
              <p>Check the current status of our platform and services.</p>
              <a href="#" className="resource-link">View Status</a>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="contact-footer">
          <div className="contact-nav">
            <Link to="/privacy" className="nav-link">Privacy Policy</Link>
            <Link to="/terms" className="nav-link">Terms of Service</Link>
            <Link to="/" className="nav-link">Back to Home</Link>
          </div>
          <p className="contact-footer-text">
            We're committed to providing excellent support and helping you succeed on your learning journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;