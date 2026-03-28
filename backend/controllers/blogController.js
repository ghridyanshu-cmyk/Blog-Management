const Blog = require('../models/Blog');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const calculateReadTime = (content) => {
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
};

// @desc Get Blogs (Filtered by author for Dashboard)
exports.getBlogs = async (req, res) => {
    try {
        const { category, author } = req.query;
        let query = {};
        
        // Logical Isolation: If 'author' is in URL, only return those blogs
        if (author) query.author = author;
        if (category && category !== 'All') query.category = category;

        const blogs = await Blog.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (err) { 
        res.status(500).json({ success: false, errors: ['Server error'] }); 
    }
};

// @desc Get Single Blog
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');
        if (!blog) return res.status(404).json({ success: false });
        res.json(blog);
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
};

// @desc Create Blog
exports.createBlog = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        if (!req.file) return res.status(400).json({ success: false, errors: ['Image required'] });

        const result = await uploadOnCloudinary(req.file.path);
        if (!result) return res.status(500).json({ success: false, errors: ['Cloud upload failed'] });

        const blog = new Blog({
            author: req.user._id, // Tied to logged in user
            title,
            category,
            content,
            image: result.url,
            readTime: calculateReadTime(content)
        });

        await blog.save();
        res.status(201).json({ success: true, message: 'Published!' });
    } catch (error) {
        res.status(500).json({ success: false, errors: [error.message] });
    }
};

// @desc Update Blog (SECURITY CHECK INCLUDED)
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false });

        // AUTHORIZATION CHECK: Compare blog author with current user ID
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, errors: ['Unauthorized edit attempt!'] });
        }

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) blog.image = result.url;
        }

        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;
        blog.category = req.body.category || blog.category;
        
        await blog.save();
        res.json({ success: true, message: 'Updated successfully' });
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
};

// @desc Delete Blog (SECURITY CHECK INCLUDED)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false });

        // AUTHORIZATION CHECK: Only author can delete
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, errors: ['You cannot delete someone else\'s post!'] });
        }

        await blog.deleteOne();
        res.json({ success: true, message: 'Deleted' });
    } catch (err) { 
        res.status(500).json({ success: false }); 
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const isLiked = blog.likes.includes(req.user._id);
        isLiked ? blog.likes.pull(req.user._id) : blog.likes.push(req.user._id);
        await blog.save();
        res.json({ success: true, likesCount: blog.likes.length });
    } catch (err) { res.status(500).json({ success: false }); }
};

// @desc Add Comment to Blog
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ success: false, errors: ['Blog not found'] });
        }

        // Create the comment object using data from the 'protect' middleware (req.user)
        const newComment = {
            user: req.user._id,
            name: req.user.name, // THIS FIXES THE ANONYMOUS ISSUE
            text: text.trim(),
            createdAt: new Date()
        };

        blog.comments.push(newComment);
        await blog.save();

        // Return the updated comments array to the frontend
        res.status(201).json({ 
            success: true, 
            comments: blog.comments 
        });

    } catch (err) {
        console.error("Comment Error:", err);
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
};

// @desc Delete Comment (Secure)
exports.deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) return res.status(404).json({ success: false });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false });

        // --- THE SECURITY CHECK ---
        const isCommentAuthor = comment.user.toString() === req.user._id.toString();
        const isBlogAuthor = blog.author.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        // Allow delete if user is Comment Author OR Blog Author OR Admin
        if (isCommentAuthor || isBlogAuthor || isAdmin) {
            blog.comments.pull(commentId);
            await blog.save();
            return res.json({ success: true, comments: blog.comments });
        }

        return res.status(403).json({ 
            success: false, 
            errors: ['Unauthorized: You can only delete your own comments or comments on your own posts.'] 
        });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};