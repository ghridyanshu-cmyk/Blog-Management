// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// DEBUG: This will print in your terminal when the server starts
console.log("Cloudinary Config Check:", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        
        // Remove local file after successful upload
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Still remove the local file if upload fails to avoid clogging your server
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        console.error("DETAILED CLOUDINARY ERROR:", error.message); 
        return null;
    }
}

module.exports = { uploadOnCloudinary };