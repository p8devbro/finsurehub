import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { getPublishedArticles } from '../utils/database';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const publishedArticles = await getPublishedArticles();
      setArticles(publishedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <section className="hero">
        <h1>Welcome to FinsureHub</h1>
        <p>Your trusted source for financial insights, insurance guides, and investment strategies.</p>
      </section>

      {/* Adsense will be added here when ready */}
      {/* <div className="ad-unit visible">
        Adsense Leaderboard (728x90)
      </div> */}

      <section className="featured-articles">
        <h2 style={{ color: '#1a365d', marginBottom: '1.5rem', fontSize: '2rem' }}>Latest Articles</h2>
        <div className="articles-grid">
          {articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>

      {articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <h3>No articles yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      )}

      {/* Adsense will be added here when ready */}
      {/* <div className="ad-unit visible">
        Adsense In-Article (300x250)
      </div> */}
    </div>
  );
};

export default Home;