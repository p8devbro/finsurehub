// Enhanced database utility with image support

let articles = JSON.parse(localStorage.getItem('finsurehub_articles')) || [];
let nextId = parseInt(localStorage.getItem('finsurehub_nextId')) || 1;

const saveToStorage = () => {
  localStorage.setItem('finsurehub_articles', JSON.stringify(articles));
  localStorage.setItem('finsurehub_nextId', nextId.toString());
};

export const getArticles = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...articles].reverse());
    }, 100);
  });
};

export const getPublishedArticles = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const published = articles.filter(article => article.published);
      resolve([...published].reverse());
    }, 100);
  });
};

export const getArticleById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const article = articles.find(a => a._id === id);
      if (article) {
        resolve(article);
      } else {
        reject(new Error('Article not found'));
      }
    }, 100);
  });
};

export const createArticle = async (articleData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newArticle = {
        _id: `article_${nextId++}`,
        ...articleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      articles.push(newArticle);
      saveToStorage();
      resolve(newArticle);
    }, 100);
  });
};

export const updateArticle = async (id, articleData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = articles.findIndex(a => a._id === id);
      if (index !== -1) {
        articles[index] = {
          ...articles[index],
          ...articleData,
          updatedAt: new Date().toISOString()
        };
        saveToStorage();
        resolve(articles[index]);
      } else {
        reject(new Error('Article not found'));
      }
    }, 100);
  });
};

export const deleteArticle = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = articles.findIndex(a => a._id === id);
      if (index !== -1) {
        articles.splice(index, 1);
        saveToStorage();
        resolve(true);
      } else {
        reject(new Error('Article not found'));
      }
    }, 100);
  });
};