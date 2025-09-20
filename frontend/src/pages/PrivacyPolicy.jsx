import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, UserCheck, Database, Globe, Mail, Clock } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        {/* Header Section */}
        <div className="privacy-header">
          <div className="privacy-icon">
            <Shield className="h-12 w-12" />
          </div>
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="privacy-meta">
            <span className="privacy-date">
              <Clock className="h-4 w-4" />
              Last updated: September 20, 2025
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="privacy-toc">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#information-collection">Information We Collect</a></li>
            <li><a href="#information-use">How We Use Your Information</a></li>
            <li><a href="#information-sharing">Information Sharing</a></li>
            <li><a href="#data-security">Data Security</a></li>
            <li><a href="#cookies">Cookies and Tracking</a></li>
            <li><a href="#user-rights">Your Rights</a></li>
            <li><a href="#data-retention">Data Retention</a></li>
            <li><a href="#children-privacy">Children's Privacy</a></li>
            <li><a href="#international-users">International Users</a></li>
            <li><a href="#policy-changes">Policy Changes</a></li>
            <li><a href="#contact-us">Contact Us</a></li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="privacy-sections">
          
          {/* Information Collection */}
          <section id="information-collection" className="privacy-section">
            <div className="section-header">
              <Database className="h-6 w-6" />
              <h2>Information We Collect</h2>
            </div>
            <div className="section-content">
              <h3>Personal Information</h3>
              <p>
                When you register for an account or use our services, we may collect:
              </p>
              <ul>
                <li>Name and email address</li>
                <li>Username and password</li>
                <li>Profile information (bio, skills, experience level)</li>
                <li>Contact information when you reach out to us</li>
              </ul>

              <h3>Usage Information</h3>
              <p>
                We automatically collect information about how you use our platform:
              </p>
              <ul>
                <li>Challenge completion data and coding solutions</li>
                <li>Learning progress and performance metrics</li>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location information</li>
                <li>Session data and usage patterns</li>
              </ul>

              <h3>Code and Submissions</h3>
              <p>
                When you participate in coding challenges, we collect:
              </p>
              <ul>
                <li>Your code submissions and solutions</li>
                <li>Test results and execution logs</li>
                <li>Comments and discussions on challenges</li>
                <li>Feedback and ratings you provide</li>
              </ul>
            </div>
          </section>

          {/* Information Use */}
          <section id="information-use" className="privacy-section">
            <div className="section-header">
              <Eye className="h-6 w-6" />
              <h2>How We Use Your Information</h2>
            </div>
            <div className="section-content">
              <p>We use your information to:</p>
              <div className="use-cases">
                <div className="use-case">
                  <h3>Provide Our Services</h3>
                  <ul>
                    <li>Create and maintain your account</li>
                    <li>Deliver personalized learning experiences</li>
                    <li>Track your progress and achievements</li>
                    <li>Enable community features and discussions</li>
                  </ul>
                </div>
                <div className="use-case">
                  <h3>Improve Our Platform</h3>
                  <ul>
                    <li>Analyze usage patterns to enhance user experience</li>
                    <li>Develop new features and challenges</li>
                    <li>Optimize platform performance</li>
                    <li>Conduct research on learning effectiveness</li>
                  </ul>
                </div>
                <div className="use-case">
                  <h3>Communication</h3>
                  <ul>
                    <li>Send important account notifications</li>
                    <li>Provide customer support</li>
                    <li>Share platform updates and new features</li>
                    <li>Send educational content (with your consent)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section id="information-sharing" className="privacy-section">
            <div className="section-header">
              <Globe className="h-6 w-6" />
              <h2>Information Sharing</h2>
            </div>
            <div className="section-content">
              <p>We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:</p>
              
              <h3>Public Information</h3>
              <ul>
                <li>Your username, profile information, and public achievements</li>
                <li>Solutions you choose to make public</li>
                <li>Comments and discussions in public forums</li>
                <li>Leaderboard rankings (if you opt-in)</li>
              </ul>

              <h3>Service Providers</h3>
              <ul>
                <li>Third-party services for hosting and infrastructure</li>
                <li>Analytics providers to understand platform usage</li>
                <li>Email service providers for notifications</li>
                <li>Payment processors for premium features</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>
                We may disclose information when required by law, court order, or to protect our rights and safety.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security" className="privacy-section">
            <div className="section-header">
              <Lock className="h-6 w-6" />
              <h2>Data Security</h2>
            </div>
            <div className="section-content">
              <p>We implement comprehensive security measures to protect your information:</p>
              
              <div className="security-measures">
                <div className="security-measure">
                  <h3>Technical Safeguards</h3>
                  <ul>
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive information</li>
                    <li>Regular security audits and assessments</li>
                    <li>Secure authentication and access controls</li>
                  </ul>
                </div>
                <div className="security-measure">
                  <h3>Operational Safeguards</h3>
                  <ul>
                    <li>Limited access to personal information</li>
                    <li>Regular staff training on privacy practices</li>
                    <li>Incident response procedures</li>
                    <li>Regular backup and recovery testing</li>
                  </ul>
                </div>
              </div>

              <div className="security-note">
                <p>
                  <strong>Note:</strong> While we implement strong security measures, no system is 100% secure. 
                  We encourage you to use strong passwords and keep your account information confidential.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies" className="privacy-section">
            <div className="section-header">
              <Globe className="h-6 w-6" />
              <h2>Cookies and Tracking</h2>
            </div>
            <div className="section-content">
              <p>We use cookies and similar technologies to enhance your experience:</p>
              
              <h3>Essential Cookies</h3>
              <ul>
                <li>Authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Basic platform functionality</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <ul>
                <li>Understanding how users interact with our platform</li>
                <li>Measuring performance and usage statistics</li>
                <li>Identifying areas for improvement</li>
              </ul>

              <h3>Preference Cookies</h3>
              <ul>
                <li>Remembering your settings and preferences</li>
                <li>Customizing content and recommendations</li>
                <li>Language and accessibility preferences</li>
              </ul>

              <p>
                You can control cookies through your browser settings. However, disabling certain cookies may affect platform functionality.
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section id="user-rights" className="privacy-section">
            <div className="section-header">
              <UserCheck className="h-6 w-6" />
              <h2>Your Rights</h2>
            </div>
            <div className="section-content">
              <p>You have the right to:</p>
              
              <div className="rights-grid">
                <div className="right-item">
                  <h3>Access</h3>
                  <p>Request a copy of the personal information we hold about you</p>
                </div>
                <div className="right-item">
                  <h3>Correction</h3>
                  <p>Update or correct your personal information through your profile settings</p>
                </div>
                <div className="right-item">
                  <h3>Deletion</h3>
                  <p>Request deletion of your account and associated data</p>
                </div>
                <div className="right-item">
                  <h3>Portability</h3>
                  <p>Export your data in a commonly used format</p>
                </div>
                <div className="right-item">
                  <h3>Opt-out</h3>
                  <p>Unsubscribe from marketing communications</p>
                </div>
                <div className="right-item">
                  <h3>Objection</h3>
                  <p>Object to certain processing of your information</p>
                </div>
              </div>

              <p>
                To exercise these rights, please contact us at <a href="mailto:privacy@praxiscode.com">privacy@praxiscode.com</a> 
                or use the settings in your account dashboard.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section id="data-retention" className="privacy-section">
            <div className="section-header">
              <Clock className="h-6 w-6" />
              <h2>Data Retention</h2>
            </div>
            <div className="section-content">
              <p>We retain your information for as long as necessary to provide our services:</p>
              
              <ul>
                <li><strong>Account Information:</strong> Until you delete your account</li>
                <li><strong>Learning Progress:</strong> Retained to maintain your achievement history</li>
                <li><strong>Code Submissions:</strong> Retained for platform improvement and your reference</li>
                <li><strong>Support Communications:</strong> Retained for 3 years for quality assurance</li>
                <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely</li>
              </ul>

              <p>
                When you delete your account, we will remove your personal information within 30 days, 
                except where we are required to retain it for legal or regulatory purposes.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section id="children-privacy" className="privacy-section">
            <div className="section-header">
              <Shield className="h-6 w-6" />
              <h2>Children's Privacy</h2>
            </div>
            <div className="section-content">
              <p>
                Our platform is designed for users 13 years and older. We do not knowingly collect 
                personal information from children under 13. If we discover that we have collected 
                information from a child under 13, we will delete it immediately.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us at <a href="mailto:privacy@praxiscode.com">privacy@praxiscode.com</a>.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section id="international-users" className="privacy-section">
            <div className="section-header">
              <Globe className="h-6 w-6" />
              <h2>International Users</h2>
            </div>
            <div className="section-content">
              <p>
                Our services are hosted in the United States. If you are accessing our platform from 
                outside the US, please be aware that your information may be transferred to, stored, 
                and processed in the United States.
              </p>
              <p>
                We comply with applicable international privacy laws, including GDPR for European users 
                and CCPA for California residents. We implement appropriate safeguards for international 
                data transfers.
              </p>
            </div>
          </section>

          {/* Policy Changes */}
          <section id="policy-changes" className="privacy-section">
            <div className="section-header">
              <Clock className="h-6 w-6" />
              <h2>Policy Changes</h2>
            </div>
            <div className="section-content">
              <p>
                We may update this Privacy Policy from time to time. When we make changes, we will:
              </p>
              <ul>
                <li>Update the "Last updated" date at the top of this policy</li>
                <li>Notify you via email for significant changes</li>
                <li>Post a notice on our platform</li>
                <li>Maintain an archive of previous versions</li>
              </ul>
              <p>
                Your continued use of our platform after changes take effect constitutes acceptance 
                of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section id="contact-us" className="privacy-section">
            <div className="section-header">
              <Mail className="h-6 w-6" />
              <h2>Contact Us</h2>
            </div>
            <div className="section-content">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our 
                privacy practices, please contact us:
              </p>
              
              <div className="contact-info">
                <div className="contact-method">
                  <h3>Email</h3>
                  <p><a href="mailto:privacy@praxiscode.com">privacy@praxiscode.com</a></p>
                </div>
                <div className="contact-method">
                  <h3>General Contact</h3>
                  <p><Link to="/contact">Contact Us Page</Link></p>
                </div>
                <div className="contact-method">
                  <h3>Response Time</h3>
                  <p>We will respond to privacy inquiries within 5 business days</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="privacy-footer">
          <div className="privacy-nav">
            <Link to="/terms" className="nav-link">Terms of Service</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/" className="nav-link">Back to Home</Link>
          </div>
          <p className="privacy-footer-text">
            Thank you for trusting PraxisCode with your learning journey. Your privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;