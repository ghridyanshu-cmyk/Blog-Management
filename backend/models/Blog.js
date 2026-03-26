const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Please add a title'],
    trim: true 
  },
  category: { 
    type: String, 
    required: [true, 'Please select a category'],
    enum: ['Tech', 'Health', 'Education', 'Sports', 'Lifestyle'] // Matches your CategoryFilter
  },
  image: { 
    type: String, 
    required: [true, 'Please provide a cover image URL'] 
  },
  content: { 
    type: String, 
    required: [true, 'Please add some content'] 
  },
  readTime: { 
    type: String, 
    default: '5 min' 
  },
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: String,
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Blog', blogSchema);