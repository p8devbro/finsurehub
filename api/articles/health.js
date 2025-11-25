const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test MongoDB connection
    const client = await MongoClient.connect(MONGODB_URI);
    await client.close();
    
    res.status(200).json({ 
      status: 'OK', 
      database: 'Connected to MongoDB',
      timestamp: new Date().toISOString(),
      service: 'FinsureHub API'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};