import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>FinsureHub</h3>
          <p>Your trusted source for financial insights, insurance guides, and investment strategies.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/category/insurance">Insurance</Link>
          <Link to="/category/finance">Finance</Link>
          <Link to="/category/investing">Investing</Link>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/about-us">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <p>Email: info@finsurehub.info</p>
          <p>Follow us on social media</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 FinsureHub. All rights reserved.</p>
        <div className="ad-unit">
          Adsense Footer Banner (728x90)
        </div>
      </div>
    </footer>
  );
};

export default Footer;