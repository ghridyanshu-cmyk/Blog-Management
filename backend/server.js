const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://blog-management1.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  })
);

app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


app.get('/', (req, res) => {
  res.json({ message: 'Stone Obsidian API is active...' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const MODE = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${MODE} mode on port ${PORT}`);
});