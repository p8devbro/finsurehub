import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function Header({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <header className="site-header sticky">
      <div className="header-inner container">
        <div className="brand">
          <img src="/public/logo.jpg" alt="FinSure Hub" className="logo" />
          <h2>FinSure Hub</h2>
        </div>
        <div className="nav">
          <button className="search-btn" onClick={handleSearch}>
            <FiSearch size={20} />
          </button>
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
