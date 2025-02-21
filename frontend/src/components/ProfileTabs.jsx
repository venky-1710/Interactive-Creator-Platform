// src/components/ProfileTabs.jsx
import { useState } from 'react';

function ProfileTabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  // Expects children to be an array of { title, content } objects
  return (
    <div className="profile-tabs">
      <div className="tabs-header">
        {children.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab].content}
      </div>
    </div>
  );
}

export default ProfileTabs;