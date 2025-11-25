const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const articles = db.collection('articles');

    switch (req.method) {
      case 'GET':
        const allArticles = await articles.find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(allArticles);
        break;
        
      case 'POST':
        const articleData = req.body;
        const article = {
          ...articleData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const result = await articles.insertOne(article);
        res.status(201).json({ ...article, _id: result.insertedId });
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};