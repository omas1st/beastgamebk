const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

// Debug environment
console.log('🔍 ENV check:', {
  mongo: process.env.MONGO_URI ? 'OK' : 'MISSING',
  email: process.env.ADMIN_EMAIL ? 'OK' : 'MISSING',
});

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('GameContest API is running'));
app.get('/api', (req, res) => res.json({ message: 'GameContest API v1' }));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Export for Vercel serverless
module.exports = app;

// Start server only when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Local server running on port ${PORT}`));
}