import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <article className="article-card">
      <div className="article-image">
        {article.image ? (
          <img src={article.image} alt={article.title} />
        ) : (
          <span>{article.category?.charAt(0).toUpperCase() || 'F'}</span>
        )}
      </div>
      <div className="article-content">
        <div className="category-tag">{article.category}</div>
        <h3 className="article-title">
          <Link to={`/article/${article._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {article.title}
          </Link>
        </h3>
        <p className="article-excerpt">
          {article.excerpt || article.content?.substring(0, 150)}...
        </p>
        <div className="article-meta">
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>Read More →</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;