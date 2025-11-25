const { MongoClient, ObjectId } = require('mongodb');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const articles = db.collection('articles');
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Article ID is required' });
    }

    switch (req.method) {
      case 'GET':
        const article = await articles.findOne({ _id: new ObjectId(id) });
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(article);
        break;
        
      case 'PUT':
        const updateData = req.body;
        const updateResult = await articles.updateOne(
          { _id: new ObjectId(id) },
          { 
            $set: {
              ...updateData,
              updatedAt: new Date().toISOString()
            }
          }
        );
        
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Article not found' });
        }
        
        res.status(200).json({ success: true, message: 'Article updated' });
        break;
        
      case 'DELETE':
        const deleteResult = await articles.deleteOne({ _id: new ObjectId(id) });
        
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Article not found' });
        }
        
        res.status(200).json({ success: true, message: 'Article deleted' });
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};