import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getArticles, deleteArticle } from '../../utils/database';
import AdminSidebar from '../../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

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
    return <div className="main-content">Loading...</div>;
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

        <Link to="/admin/create" className="btn btn-success" style={{ marginBottom: '2rem' }}>
          Create New Article
        </Link>

        <div className="articles-list">
          {articles.map(article => (
            <div key={article._id} className="article-card" style={{ marginBottom: '1rem' }}>
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>Status: {article.published ? 'Published' : 'Draft'}</p>
                <p>Category: {article.category}</p>
                <p>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                <div style={{ marginTop: '1rem' }}>
                  <Link to={`/admin/edit/${article._id}`} className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;