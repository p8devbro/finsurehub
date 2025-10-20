import React from "react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/logo.png" alt="FinSure Hub" className="logo" />
          <div>
            <h2>FinSure Hub</h2>
            <div className="sub">Finance · Insurance · Fintech</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#" onClick={(e)=>e.preventDefault()}>Home</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Finance</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Insurance</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>About</a>
        </nav>
      </div>
    </header>
  );
}
