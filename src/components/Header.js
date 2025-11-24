import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            FinsureHub
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/category/insurance">Insurance</Link></li>
          <li><Link to="/category/finance">Finance</Link></li>
          <li><Link to="/category/investing">Investing</Link></li>
          {/* Admin link removed from public view */}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/category/insurance" onClick={() => setMobileMenuOpen(false)}>Insurance</Link></li>
          <li><Link to="/category/finance" onClick={() => setMobileMenuOpen(false)}>Finance</Link></li>
          <li><Link to="/category/investing" onClick={() => setMobileMenuOpen(false)}>Investing</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;