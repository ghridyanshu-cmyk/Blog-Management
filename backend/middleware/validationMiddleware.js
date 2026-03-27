const validateBlogData = (req, res, next) => {
  const { title, category, content, image } = req.body;
  
  const errors = [];
  
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!category || !['Tech', 'Health', 'Education', 'Sports', 'Lifestyle'].includes(category)) {
    errors.push('Please select a valid category');
  }
  
  if (!content || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }
  
  if (!image || !image.trim()) {
    errors.push('Please provide a valid image URL or path');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};

const validateComment = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || text.trim().length < 1) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }
  
  if (text.length > 500) {
    return res.status(400).json({ message: 'Comment cannot exceed 500 characters' });
  }
  
  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateBlogData, validateComment, validateRegister, validateLogin };