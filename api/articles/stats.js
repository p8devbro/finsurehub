const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('finsurehub');
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const articles = db.collection('articles');

    const totalArticles = await articles.countDocuments();
    const publishedArticles = await articles.countDocuments({ published: true });
    const categories = await articles.distinct('category');
    
    res.status(200).json({
      totalArticles,
      publishedArticles,
      categories: categories.length > 0 ? categories : ['finance', 'insurance', 'investing'],
      storage: 'MongoDB Atlas - 512GB Free Tier'
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    res.status(500).json({ error: error.message });
  }
};