import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const handleApiCall = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error);
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.response?.status === 404) {
      throw new Error('Resource not found.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(errorMessage);
    }
  }
};

// Image compression function (keep your existing one)
const compressImage = async (base64String, maxSizeKB = 200) => {
  // ... keep your existing compressImage function
};

export const getArticles = async () => {
  return handleApiCall(
    () => api.get('/articles'),
    'Failed to fetch articles'
  );
};

export const getPublishedArticles = async () => {
  return handleApiCall(
    () => api.get('/articles/published'),
    'Failed to fetch published articles'
  );
};

export const getArticleById = async (id) => {
  return handleApiCall(
    () => api.get(`/articles/${id}`),
    'Failed to fetch article'
  );
};

export const createArticle = async (articleData) => {
  const processedArticle = {
    ...articleData,
    image: articleData.image ? await compressImage(articleData.image) : ''
  };

  return handleApiCall(
    () => api.post('/articles', processedArticle),
    'Failed to create article'
  );
};

export const updateArticle = async (id, articleData) => {
  const processedArticle = {
    ...articleData,
    image: articleData.image ? await compressImage(articleData.image) : ''
  };

  return handleApiCall(
    () => api.put(`/articles/${id}`, processedArticle),
    'Failed to update article'
  );
};

export const deleteArticle = async (id) => {
  return handleApiCall(
    () => api.delete(`/articles/${id}`),
    'Failed to delete article'
  );
};

export const getStorageStats = async () => {
  try {
    const articles = await getArticles();
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.published).length;
    
    let totalSizeBytes = 0;
    articles.forEach(article => {
      totalSizeBytes += new TextEncoder().encode(JSON.stringify(article)).length;
      if (article.image) {
        totalSizeBytes += (article.image.length * 3) / 4;
      }
    });
    
    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    const storagePercentage = (totalSizeMB / 51200) * 100;
    const estimatedRemaining = Math.floor((51200 - totalSizeMB) / 0.15);
    
    return {
      totalArticles,
      publishedArticles,
      totalSizeMB: totalSizeMB.toFixed(2),
      storagePercentage: storagePercentage.toFixed(2),
      estimatedRemaining,
      status: totalSizeMB < 100 ? '🟢 Excellent' : totalSizeMB < 1000 ? '🟡 Good' : '🔴 Monitor'
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

export const healthCheck = async () => {
  return handleApiCall(
    () => api.get('/health'),
    'API health check failed'
  );
};

export const getSystemStats = async () => {
  return handleApiCall(
    () => api.get('/stats'),
    'Failed to get system stats'
  );
};