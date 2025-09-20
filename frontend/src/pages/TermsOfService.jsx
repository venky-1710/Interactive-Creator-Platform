import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, FileText, Users, Shield, AlertTriangle, Clock, Mail, CheckCircle } from 'lucide-react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        {/* Header Section */}
        <div className="terms-header">
          <div className="terms-icon">
            <Scale className="h-12 w-12" />
          </div>
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">
            Welcome to PraxisCode. These terms govern your use of our interactive learning platform.
          </p>
          <div className="terms-meta">
            <span className="terms-date">
              <Clock className="h-4 w-4" />
              Last updated: September 20, 2025
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="terms-toc">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#acceptance">Acceptance of Terms</a></li>
            <li><a href="#description">Service Description</a></li>
            <li><a href="#user-accounts">User Accounts</a></li>
            <li><a href="#user-conduct">User Conduct</a></li>
            <li><a href="#content-policy">Content Policy</a></li>
            <li><a href="#intellectual-property">Intellectual Property</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#payments">Payments and Subscriptions</a></li>
            <li><a href="#disclaimers">Disclaimers</a></li>
            <li><a href="#limitation-liability">Limitation of Liability</a></li>
            <li><a href="#termination">Termination</a></li>
            <li><a href="#governing-law">Governing Law</a></li>
            <li><a href="#changes">Changes to Terms</a></li>
            <li><a href="#contact">Contact Information</a></li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="terms-sections">
          
          {/* Acceptance of Terms */}
          <section id="acceptance" className="terms-section">
            <div className="section-header">
              <CheckCircle className="h-6 w-6" />
              <h2>Acceptance of Terms</h2>
            </div>
            <div className="section-content">
              <p>
                By accessing and using PraxisCode ("the Platform", "our Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <div className="important-notice">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h3>Important Notice</h3>
                  <p>
                    If you do not agree to abide by the above, please do not use this service. 
                    Your continued use of the Platform constitutes acceptance of these terms.
                  </p>
                </div>
              </div>
              <p>
                These Terms of Service ("Terms") apply to all visitors, users, and others who access or use the service.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section id="description" className="terms-section">
            <div className="section-header">
              <FileText className="h-6 w-6" />
              <h2>Service Description</h2>
            </div>
            <div className="section-content">
              <p>
                PraxisCode is an interactive learning platform that provides:
              </p>
              <div className="service-features">
                <div className="feature">
                  <h3>Coding Challenges</h3>
                  <p>Interactive programming exercises across multiple languages and difficulty levels</p>
                </div>
                <div className="feature">
                  <h3>Learning Resources</h3>
                  <p>Educational content, tutorials, and documentation to support your learning journey</p>
                </div>
                <div className="feature">
                  <h3>Community Features</h3>
                  <p>Discussion forums, code sharing, and collaborative learning opportunities</p>
                </div>
                <div className="feature">
                  <h3>Progress Tracking</h3>
                  <p>Personal dashboards, achievement systems, and performance analytics</p>
                </div>
              </div>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our service at any time with reasonable notice.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section id="user-accounts" className="terms-section">
            <div className="section-header">
              <Users className="h-6 w-6" />
              <h2>User Accounts</h2>
            </div>
            <div className="section-content">
              <h3>Account Creation</h3>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Update your information to keep it accurate</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3>Account Requirements</h3>
              <div className="requirements-grid">
                <div className="requirement">
                  <h4>Age Requirement</h4>
                  <p>You must be at least 13 years old to create an account</p>
                </div>
                <div className="requirement">
                  <h4>One Account Per Person</h4>
                  <p>You may only create one account per person</p>
                </div>
                <div className="requirement">
                  <h4>Accurate Information</h4>
                  <p>All registration information must be truthful and up-to-date</p>
                </div>
              </div>

              <h3>Account Termination</h3>
              <p>
                You may terminate your account at any time. We may terminate accounts that violate these terms or for any other reason with appropriate notice.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section id="user-conduct" className="terms-section">
            <div className="section-header">
              <Shield className="h-6 w-6" />
              <h2>User Conduct</h2>
            </div>
            <div className="section-content">
              <p>You agree to use our platform responsibly and in accordance with these guidelines:</p>
              
              <h3>Acceptable Use</h3>
              <div className="conduct-section acceptable">
                <h4>✓ You May:</h4>
                <ul>
                  <li>Use the platform for educational and learning purposes</li>
                  <li>Share knowledge and help other learners</li>
                  <li>Submit original code solutions</li>
                  <li>Participate in discussions respectfully</li>
                  <li>Report violations of these terms</li>
                </ul>
              </div>

              <h3>Prohibited Activities</h3>
              <div className="conduct-section prohibited">
                <h4>✗ You May Not:</h4>
                <ul>
                  <li>Violate any laws or regulations</li>
                  <li>Harass, bully, or threaten other users</li>
                  <li>Share inappropriate, offensive, or harmful content</li>
                  <li>Attempt to hack, disrupt, or damage the platform</li>
                  <li>Use automated tools to access the service</li>
                  <li>Share copyrighted material without permission</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                  <li>Engage in academic dishonesty or cheating</li>
                </ul>
              </div>

              <div className="warning-notice">
                <AlertTriangle className="h-5 w-5" />
                <p>
                  <strong>Warning:</strong> Violations of these conduct rules may result in warnings, 
                  temporary suspension, or permanent account termination.
                </p>
              </div>
            </div>
          </section>

          {/* Content Policy */}
          <section id="content-policy" className="terms-section">
            <div className="section-header">
              <FileText className="h-6 w-6" />
              <h2>Content Policy</h2>
            </div>
            <div className="section-content">
              <h3>User-Generated Content</h3>
              <p>
                When you submit content to our platform (code, comments, discussions), you retain ownership 
                but grant us certain rights to use, display, and distribute your content.
              </p>

              <h3>Content Standards</h3>
              <p>All content must be:</p>
              <ul>
                <li>Legal and compliant with applicable laws</li>
                <li>Respectful and appropriate for an educational environment</li>
                <li>Original or properly attributed</li>
                <li>Relevant to the platform's educational purpose</li>
              </ul>

              <h3>Content Moderation</h3>
              <p>We reserve the right to:</p>
              <ul>
                <li>Review and moderate user-generated content</li>
                <li>Remove content that violates our policies</li>
                <li>Take action against users who repeatedly violate guidelines</li>
              </ul>

              <h3>Reporting Content</h3>
              <p>
                If you encounter content that violates our policies, please report it through our 
                platform tools or contact us directly.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual-property" className="terms-section">
            <div className="section-header">
              <Shield className="h-6 w-6" />
              <h2>Intellectual Property</h2>
            </div>
            <div className="section-content">
              <h3>Our Content</h3>
              <p>
                The platform, including all challenges, tutorials, and educational materials, 
                is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3>License to Use</h3>
              <p>We grant you a limited, non-exclusive, non-transferable license to:</p>
              <ul>
                <li>Access and use the platform for personal, educational purposes</li>
                <li>Download and print materials for personal study</li>
                <li>Share solutions and participate in community discussions</li>
              </ul>

              <h3>User Content Rights</h3>
              <p>For content you submit:</p>
              <ul>
                <li>You retain ownership of your original code and solutions</li>
                <li>You grant us a license to display and use your content on the platform</li>
                <li>You may make your solutions public or keep them private</li>
                <li>You are responsible for ensuring you have rights to submit the content</li>
              </ul>

              <h3>Copyright Infringement</h3>
              <p>
                We respect intellectual property rights. If you believe content on our platform 
                infringes your copyright, please contact us with a detailed notice.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="terms-section">
            <div className="section-header">
              <Shield className="h-6 w-6" />
              <h2>Privacy</h2>
            </div>
            <div className="section-content">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, 
                use, and protect your information when you use our service.
              </p>
              <div className="privacy-highlight">
                <p>
                  <strong>Privacy Policy:</strong> By using our service, you also agree to our 
                  <Link to="/privacy"> Privacy Policy</Link>, which is incorporated into these terms by reference.
                </p>
              </div>
              <p>Key privacy principles:</p>
              <ul>
                <li>We collect only necessary information to provide our service</li>
                <li>We protect your data with appropriate security measures</li>
                <li>We do not sell your personal information to third parties</li>
                <li>You have control over your privacy settings and data</li>
              </ul>
            </div>
          </section>

          {/* Payments */}
          <section id="payments" className="terms-section">
            <div className="section-header">
              <FileText className="h-6 w-6" />
              <h2>Payments and Subscriptions</h2>
            </div>
            <div className="section-content">
              <h3>Free and Premium Services</h3>
              <p>
                We offer both free and premium features. Premium features require a subscription or one-time payment.
              </p>

              <h3>Payment Terms</h3>
              <ul>
                <li>All fees are in USD unless otherwise specified</li>
                <li>Subscription fees are billed in advance</li>
                <li>Payment is due immediately upon subscription</li>
                <li>All sales are final unless otherwise required by law</li>
              </ul>

              <h3>Cancellation and Refunds</h3>
              <ul>
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the billing period</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Access to premium features ends when subscription expires</li>
              </ul>

              <h3>Price Changes</h3>
              <p>
                We may change our prices with 30 days' notice. Price changes do not affect existing subscriptions until renewal.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers" className="terms-section">
            <div className="section-header">
              <AlertTriangle className="h-6 w-6" />
              <h2>Disclaimers</h2>
            </div>
            <div className="section-content">
              <div className="disclaimer-notice">
                <h3>Service "As Is"</h3>
                <p>
                  Our service is provided "as is" and "as available" without warranties of any kind, 
                  either express or implied.
                </p>
              </div>

              <h3>No Warranties</h3>
              <p>We disclaim all warranties, including but not limited to:</p>
              <ul>
                <li>Merchantability and fitness for a particular purpose</li>
                <li>Non-infringement of third-party rights</li>
                <li>Accuracy, completeness, or reliability of content</li>
                <li>Uninterrupted or error-free service</li>
              </ul>

              <h3>Educational Purpose</h3>
              <p>
                Our platform is designed for educational purposes. We do not guarantee that completion 
                of challenges or courses will result in employment or specific outcomes.
              </p>

              <h3>Third-Party Content</h3>
              <p>
                We may include links to third-party websites or services. We are not responsible 
                for the content, privacy policies, or practices of third parties.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation-liability" className="terms-section">
            <div className="section-header">
              <AlertTriangle className="h-6 w-6" />
              <h2>Limitation of Liability</h2>
            </div>
            <div className="section-content">
              <div className="liability-notice">
                <p>
                  <strong>Important:</strong> To the fullest extent permitted by applicable law, 
                  PraxisCode shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages.
                </p>
              </div>

              <h3>Liability Limits</h3>
              <p>Our total liability to you for any claim shall not exceed:</p>
              <ul>
                <li>The amount you paid us in the 12 months before the claim arose, or</li>
                <li>$100, whichever is greater</li>
              </ul>

              <h3>Exclusions</h3>
              <p>We are not liable for:</p>
              <ul>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Service interruptions or technical issues</li>
                <li>Actions of other users on the platform</li>
                <li>Content accuracy or learning outcomes</li>
              </ul>

              <h3>User Responsibility</h3>
              <p>
                You acknowledge that you use our service at your own risk and are responsible 
                for your learning progress and outcomes.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="terms-section">
            <div className="section-header">
              <AlertTriangle className="h-6 w-6" />
              <h2>Termination</h2>
            </div>
            <div className="section-content">
              <h3>Termination by You</h3>
              <p>You may terminate your account at any time by:</p>
              <ul>
                <li>Using the account deletion feature in your profile settings</li>
                <li>Contacting our support team</li>
                <li>Ceasing to use the service</li>
              </ul>

              <h3>Termination by Us</h3>
              <p>We may terminate your account if:</p>
              <ul>
                <li>You violate these Terms of Service</li>
                <li>You engage in prohibited activities</li>
                <li>We discontinue the service</li>
                <li>Required by law or legal process</li>
              </ul>

              <h3>Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul>
                <li>Your access to the platform will be suspended</li>
                <li>Your account data may be deleted</li>
                <li>Outstanding payments remain due</li>
                <li>Certain provisions of these terms survive termination</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section id="governing-law" className="terms-section">
            <div className="section-header">
              <Scale className="h-6 w-6" />
              <h2>Governing Law</h2>
            </div>
            <div className="section-content">
              <p>
                These Terms shall be interpreted and governed by the laws of the United States, 
                without regard to conflict of law provisions.
              </p>

              <h3>Dispute Resolution</h3>
              <p>
                Any disputes arising from these terms or your use of our service shall be resolved through:
              </p>
              <ol>
                <li><strong>Direct Communication:</strong> We encourage resolving issues through direct contact first</li>
                <li><strong>Mediation:</strong> If direct communication fails, we may pursue mediation</li>
                <li><strong>Arbitration:</strong> Binding arbitration as a final resort for significant disputes</li>
              </ol>

              <h3>Jurisdiction</h3>
              <p>
                You agree to the jurisdiction of the federal and state courts located in the United States 
                for any legal proceedings.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section id="changes" className="terms-section">
            <div className="section-header">
              <Clock className="h-6 w-6" />
              <h2>Changes to Terms</h2>
            </div>
            <div className="section-content">
              <h3>Modification Rights</h3>
              <p>
                We reserve the right to modify these terms at any time. When we make changes, we will:
              </p>
              <ul>
                <li>Update the "Last updated" date</li>
                <li>Notify users via email for significant changes</li>
                <li>Post notice on the platform</li>
                <li>Provide a reasonable period for review</li>
              </ul>

              <h3>Acceptance of Changes</h3>
              <p>
                Your continued use of the platform after changes take effect constitutes acceptance 
                of the updated terms. If you disagree with changes, you should discontinue use of the service.
              </p>

              <h3>Version History</h3>
              <p>
                We maintain a record of significant changes to these terms. Previous versions 
                are available upon request.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="terms-section">
            <div className="section-header">
              <Mail className="h-6 w-6" />
              <h2>Contact Information</h2>
            </div>
            <div className="section-content">
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              
              <div className="contact-info">
                <div className="contact-method">
                  <h3>Legal Inquiries</h3>
                  <p><a href="mailto:legal@praxiscode.com">legal@praxiscode.com</a></p>
                </div>
                <div className="contact-method">
                  <h3>General Support</h3>
                  <p><Link to="/contact">Contact Us Page</Link></p>
                </div>
                <div className="contact-method">
                  <h3>Response Time</h3>
                  <p>We respond to legal inquiries within 7 business days</p>
                </div>
              </div>

              <h3>Additional Information</h3>
              <p>
                For privacy-related questions, please see our <Link to="/privacy">Privacy Policy</Link> 
                or contact our privacy team directly.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="terms-footer">
          <div className="terms-nav">
            <Link to="/privacy" className="nav-link">Privacy Policy</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/" className="nav-link">Back to Home</Link>
          </div>
          <p className="terms-footer-text">
            By using PraxisCode, you agree to these terms and commit to learning with integrity and respect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;