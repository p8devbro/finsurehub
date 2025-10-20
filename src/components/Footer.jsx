import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} FinSure Hub — Finance & Insurance Insights</p>
        <small>Built for CiliconWallet · Privacy · Terms</small>
      </div>
    </footer>
  );
}
