import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="main-content">
      <div className="single-article">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, including when you create an account, 
          subscribe to our newsletter, or contact us for support.
        </p>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze trends and usage</li>
        </ul>
        
        <h2>Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our service and 
          hold certain information to improve user experience.
        </p>
        
        <h2>Third-Party Services</h2>
        <p>
          We may use third-party service providers to monitor and analyze the use of our service, 
          such as Google Analytics and Google AdSense.
        </p>
        
        <h2>Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes 
          by posting the new Privacy Policy on this page.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at 
          info@finsurehub.info
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;