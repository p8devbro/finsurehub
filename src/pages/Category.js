import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { getPublishedArticles } from '../utils/database';

const Category = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [category]);

  const loadArticles = async () => {
    try {
      const allArticles = await getPublishedArticles();
      const filtered = allArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
      setArticles(filtered);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Articles</h1>
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
      {articles.length === 0 && <p>No articles found in this category.</p>}
    </div>
  );
};

export default Category;