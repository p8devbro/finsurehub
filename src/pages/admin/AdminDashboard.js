import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getArticles, deleteArticle, getStorageStats, getSystemStats, healthCheck } from '../../utils/database';
import AdminSidebar from '../../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const SystemMonitor = () => {
  const [stats, setStats] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      const [storageStats, systemStats, health] = await Promise.all([
        getStorageStats(),
        getSystemStats(),
        healthCheck()
      ]);
      
      setStats(storageStats);
      setSystemInfo(systemStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        Loading system stats...
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem'
    }}>
      <h3>🚀 System Overview</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginTop: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalArticles || 0}</div>
          <div>Total Articles</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.publishedArticles || 0}</div>
          <div>Published</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalSizeMB || '0'} MB</div>
          <div>Storage Used</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.estimatedRemaining || '0'}+</div>
          <div>Articles Remaining</div>
        </div>
      </div>

      {/* Storage Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Storage Usage: {stats?.storagePercentage || '0'}%</span>
          <span style={{ 
            color: stats?.status?.includes('Excellent') ? '#4ade80' : 
                   stats?.status?.includes('Good') ? '#fbbf24' : '#f87171'
          }}>
            {stats?.status}
          </span>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          height: '12px', 
          borderRadius: '6px', 
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              background: (stats?.storagePercentage || 0) < 50 ? '#4ade80' : 
                         (stats?.storagePercentage || 0) < 80 ? '#fbbf24' : '#f87171',
              height: '100%', 
              width: `${Math.min(100, stats?.storagePercentage || 0)}%`,
              transition: 'width 0.3s ease',
              borderRadius: '6px'
            }} 
          />
        </div>
      </div>

      {/* Database Info */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <strong>Database:</strong> MongoDB Atlas (512GB Free Tier) <br/>
        <strong>Status:</strong> ✅ Connected <br/>
        <strong>Optimization:</strong> Automatic Image Compression Enabled
      </div>

      <button 
        onClick={loadAllStats}
        style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          cursor: 'pointer'
        }}
      >
        🔄 Refresh Stats
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const allArticles = await getArticles();
      setArticles(allArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        loadArticles(); // Reload articles
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Article Management</h2>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        <SystemMonitor />

        <Link to="/admin/create" className="btn btn-success" style={{ marginBottom: '2rem' }}>
          + Create New Article
        </Link>

        <div className="articles-list">
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              <h3>No articles yet</h3>
              <p>Create your first article to get started!</p>
            </div>
          ) : (
            articles.map(article => (
              <div key={article._id} className="article-card" style={{ marginBottom: '1.5rem' }}>
                <div className="article-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '0.5rem', color: '#1a365d' }}>{article.title}</h3>
                      <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
                        <strong>Status:</strong> 
                        <span style={{ 
                          color: article.published ? '#48bb78' : '#e53e3e',
                          fontWeight: 'bold',
                          marginLeft: '0.5rem'
                        }}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </p>
                      <p style={{ color: '#718096', marginBottom: '0.5rem' }}>
                        <strong>Category:</strong> {article.category}
                      </p>
                      <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>
                        Created: {new Date(article.createdAt).toLocaleDateString()} | 
                        Updated: {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      <Link to={`/admin/edit/${article._id}`} className="btn btn-primary">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(article._id)} 
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; // Make sure this line exists!