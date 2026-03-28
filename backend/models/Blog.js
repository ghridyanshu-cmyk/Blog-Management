const mongoose = require('mongoose');

// Separate schema for comments for cleaner code and better validation
const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { 
    type: String, 
    required: true // This ensures every comment MUST have a name saved
  },
  text: { 
    type: String, 
    required: [true, 'Comment text cannot be empty'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

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
    enum: ['Tech', 'Health', 'Education', 'Sports', 'Lifestyle']
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
  comments: [commentSchema] // Using the defined schema above
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Blog', blogSchema);