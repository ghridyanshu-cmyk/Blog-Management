const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Stone Obsidian API is active...' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const mode = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`✨ Server running in ${mode} mode on port ${PORT}`);
});