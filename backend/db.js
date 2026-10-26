// MongoDB connection
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'test') {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  mongoose.connect(mongoUri);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  db.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
      const Project = require('./models/project');
      await Project.createIndexes();
      console.log('Indexes ensured');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  });
}
