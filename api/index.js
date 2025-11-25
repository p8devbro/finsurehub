const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection - using your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://finsurehubinfo_db_user:P0RG5mbZA7VNwv58@cluster0.qh1z9zs.mongodb.net/finsurehub?retryWrites=true&w=majority';

const client = new MongoClient(MONGODB_URI);

let db, articles;

async function connectDB() {
  if (db) return;
  try {
    await client.connect();
    db = client.db('finsurehub');
    articles = db.collection('articles');
    
    // Create indexes for better performance
    await articles.createIndex({ published: 1, createdAt: -1 });
    await articles.createIndex({ category: 1 });
    
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Simple image optimization (runs in browser, not in serverless function)
function shouldCompressImage(base64String) {
  if (!base64String || !base64String.startsWith('data:image')) return false;
  
  // Compress if larger than 300KB
  const sizeKB = (base64String.length * 3) / 4 / 1024;
  return sizeKB > 300;
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = pathname.split('/').filter(part => part);
    
    console.log(`📨 ${req.method} request to: ${pathname}`);

    // Route handling
    if (req.method === 'GET') {
      if (pathParts[2] === 'published') {
        // GET /api/articles/published
        const publishedArticles = await articles.find({ published: true }).sort({ createdAt: -1 }).toArray();
        console.log(`📄 Found ${publishedArticles.length} published articles`);
        res.json(publishedArticles);
      } else if (pathParts[2]) {
        // GET /api/articles/:id
        try {
          const article = await articles.findOne({ _id: new ObjectId(pathParts[2]) });
          if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
          }
          console.log(`📖 Found article: ${article.title}`);
          res.json(article);
        } catch (idError) {
          res.status(400).json({ error: 'Invalid article ID' });
        }
      } else if (pathParts[1] === 'health') {
        // GET /api/health
        res.json({ 
          status: 'OK', 
          database: 'Connected',
          timestamp: new Date().toISOString(),
          service: 'FinsureHub API'
        });
      } else if (pathParts[1] === 'stats') {
        // GET /api/stats
        const totalArticles = await articles.countDocuments();
        const publishedArticles = await articles.countDocuments({ published: true });
        const categories = await articles.distinct('category');
        
        res.json({
          totalArticles,
          publishedArticles,
          categories,
          storage: 'MongoDB Atlas - 512GB Free'
        });
      } else {
        // GET /api/articles
        const allArticles = await articles.find({}).sort({ createdAt: -1 }).toArray();
        console.log(`📚 Found ${allArticles.length} total articles`);
        res.json(allArticles);
      }
    } else if (req.method === 'POST' && pathParts[1] === 'articles') {
      // POST /api/articles
      const articleData = req.body;
      
      // Validate required fields
      if (!articleData.title || !articleData.content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }
      
      const article = {
        title: articleData.title,
        excerpt: articleData.excerpt || '',
        content: articleData.content,
        category: articleData.category || 'finance',
        published: Boolean(articleData.published),
        image: articleData.image || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Check if image needs compression (note for client)
      if (article.image && shouldCompressImage(article.image)) {
        console.log('⚠️ Large image detected - client should compress');
      }
      
      const result = await articles.insertOne(article);
      console.log(`✅ Created article: ${article.title}`);
      res.json({ ...article, _id: result.insertedId });
    } else if (req.method === 'PUT' && pathParts[2]) {
      // PUT /api/articles/:id
      const articleData = req.body;
      
      try {
        const article = {
          ...articleData,
          updatedAt: new Date().toISOString()
        };
        
        const result = await articles.updateOne(
          { _id: new ObjectId(pathParts[2]) },
          { $set: article }
        );
        
        if (result.matchedCount === 0) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        
        console.log(`✏️ Updated article: ${articleData.title}`);
        res.json(article);
      } catch (idError) {
        res.status(400).json({ error: 'Invalid article ID' });
      }
    } else if (req.method === 'DELETE' && pathParts[2]) {
      // DELETE /api/articles/:id
      try {
        const result = await articles.deleteOne({ _id: new ObjectId(pathParts[2]) });
        
        if (result.deletedCount === 0) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        
        console.log(`🗑️ Deleted article: ${pathParts[2]}`);
        res.json({ success: true, message: 'Article deleted successfully' });
      } catch (idError) {
        res.status(400).json({ error: 'Invalid article ID' });
      }
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};