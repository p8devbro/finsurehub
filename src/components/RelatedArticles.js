import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedArticles } from '../utils/database';

const RelatedArticles = ({ currentArticleId, category }) => {
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    loadRelatedArticles();
  }, [currentArticleId, category]);

  const loadRelatedArticles = async () => {
    try {
      const allArticles = await getPublishedArticles();
      const related = allArticles
        .filter(article => 
          article._id !== currentArticleId && 
          article.category === category
        )
        .slice(0, 3); // Show 3 related articles
      setRelatedArticles(related);
    } catch (error) {
      console.error('Error loading related articles:', error);
    }
  };

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="related-articles" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Related Articles</h3>
      <div className="articles-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {relatedArticles.map(article => (
          <div key={article._id} className="article-card" style={{ marginBottom: '1rem' }}>
            <div className="article-image" style={{ 
              background: article.featuredImage ? `url(${article.featuredImage}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '120px'
            }}>
              {!article.featuredImage && article.category?.charAt(0).toUpperCase()}
            </div>
            <div className="article-content">
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <Link to={`/article/${article._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {article.title}
                </Link>
              </h4>
              <div className="article-meta">
                <span>{article.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;