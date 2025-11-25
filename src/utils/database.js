import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Enhanced image compression with multiple fallbacks
const compressImage = async (base64String, maxSizeKB = 200) => {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String;
  }

  // Calculate current size
  const currentSizeKB = Math.ceil((base64String.length * 3) / 4 / 1024);
  
  // If already under limit, return as is
  if (currentSizeKB <= maxSizeKB) {
    return base64String;
  }

  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;
      
      // Progressive compression based on original size
      let maxDimension;
      let quality;
      
      if (currentSizeKB > 2000) { // >2MB
        maxDimension = 600;
        quality = 0.4;
      } else if (currentSizeKB > 1000) { // >1MB
        maxDimension = 800;
        quality = 0.5;
      } else if (currentSizeKB > 500) { // >500KB
        maxDimension = 1000;
        quality = 0.6;
      } else { // <500KB
        maxDimension = 1200;
        quality = 0.7;
      }

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // High-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first (better compression), fallback to JPEG
      let optimizedBase64;
      try {
        optimizedBase64 = canvas.toDataURL('image/webp', quality);
        const webpSizeKB = Math.ceil((optimizedBase64.length * 3) / 4 / 1024);
        
        // If WebP isn't smaller, use JPEG
        if (webpSizeKB >= currentSizeKB * 0.8) {
          optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
        }
      } catch (webpError) {
        // WebP not supported, use JPEG
        optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
      }

      const finalSizeKB = Math.ceil((optimizedBase64.length * 3) / 4 / 1024);
      console.log(`🖼️ Image compressed: ${currentSizeKB}KB → ${finalSizeKB}KB (${Math.round((1 - finalSizeKB/currentSizeKB) * 100)}% reduction)`);
      
      resolve(optimizedBase64);
    };

    img.onerror = () => {
      console.warn('⚠️ Image compression failed, using original');
      resolve(base64String);
    };

    img.src = base64String;
  });
};

// API calls with enhanced error handling
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
  // Always compress images before sending to server
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
  // Always compress images before sending to server
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

// Enhanced storage monitoring
export const getStorageStats = async () => {
  try {
    const articles = await getArticles();
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.published).length;
    
    // Calculate accurate storage usage
    let totalSizeBytes = 0;
    articles.forEach(article => {
      totalSizeBytes += new TextEncoder().encode(JSON.stringify(article)).length;
      if (article.image) {
        totalSizeBytes += (article.image.length * 3) / 4; // Base64 to bytes
      }
    });
    
    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    const storagePercentage = (totalSizeMB / 51200) * 100; // 51200 MB in 50GB
    const estimatedRemaining = Math.floor((51200 - totalSizeMB) / 0.15); // ~150KB per article
    
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

// Health check
export const healthCheck = async () => {
  return handleApiCall(
    () => api.get('/health'),
    'API health check failed'
  );
};

// Get system stats
export const getSystemStats = async () => {
  return handleApiCall(
    () => api.get('/stats'),
    'Failed to get system stats'
  );
};