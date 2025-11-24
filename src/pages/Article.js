import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById, getPublishedArticles } from '../utils/database';
import ArticleCard from '../components/ArticleCard';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticleAndRelated();
  }, [id]);

  const loadArticleAndRelated = async () => {
    try {
      const [articleData, allArticlesData] = await Promise.all([
        getArticleById(id),
        getPublishedArticles()
      ]);
      
      setArticle(articleData);
      setAllArticles(allArticlesData);
      
      // Get related articles (same category, excluding current)
      const related = allArticlesData
        .filter(a => a._id !== id && a.category === articleData.category)
        .slice(0, 3);
      setRelatedArticles(related);
      
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArticleIndex = () => {
    return allArticles.findIndex(a => a._id === id);
  };

  const getNextArticle = () => {
    const index = getArticleIndex();
    return index > 0 ? allArticles[index - 1] : null;
  };

  const getPreviousArticle = () => {
    const index = getArticleIndex();
    return index < allArticles.length - 1 ? allArticles[index + 1] : null;
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Article not found</h2>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const nextArticle = getNextArticle();
  const previousArticle = getPreviousArticle();

  return (
    <div className="main-content">
      <article className="single-article">
        <header className="article-header">
          <div className="category-tag" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            {article.category}
          </div>
          <h1>{article.title}</h1>
          <div className="article-meta" style={{ justifyContent: 'center' }}>
            <span>Published on {new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        {article.image && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src={article.image} 
              alt={article.title}
              style={{ maxWidth: '100%', borderRadius: '12px' }}
            />
          </div>
        )}

        {/* Adsense will be added here when ready */}
        {/* <div className="ad-unit visible">
          Adsense In-Article Top (300x600)
        </div> */}

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Adsense will be added here when ready */}
        {/* <div className="ad-unit visible">
          Adsense In-Article Bottom (300x250)
        </div> */}

        {/* Article Navigation */}
        <div className="article-navigation">
          {previousArticle ? (
            <Link to={`/article/${previousArticle._id}`} className="nav-btn">
              ← Previous: {previousArticle.title}
            </Link>
          ) : (
            <span className="nav-btn disabled">← Previous</span>
          )}
          
          {nextArticle ? (
            <Link to={`/article/${nextArticle._id}`} className="nav-btn">
              Next: {nextArticle.title} →
            </Link>
          ) : (
            <span className="nav-btn disabled">Next →</span>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="related-articles">
          <h2>Related Articles</h2>
          <div className="articles-grid">
            {relatedArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Reads */}
      <section className="related-articles">
        <h2>Recommended Reads</h2>
        <div className="articles-grid">
          {allArticles
            .filter(a => a._id !== id)
            .slice(0, 3)
            .map(article => (
              <ArticleCard key={article._id} article={article} />
            ))
          }
        </div>
      </section>
    </div>
  );
};

export default Article;