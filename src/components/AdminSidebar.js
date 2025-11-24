import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #2d3748' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Admin Panel</h3>
      </div>
      <nav>
        <ul className="admin-menu">
          <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/admin/create' ? 'active' : ''}>
            <Link to="/admin/create">Create Article</Link>
          </li>
          <li>
            <Link to="/">View Site</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;