const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Message: ${error.message}`);

    if (error.message.includes('authentication failed')) {
      console.error(`\n⚠️  AUTHENTICATION FAILED - Check your MongoDB Atlas credentials:`);
      console.error(`   1. Verify username and password in MONGO_URI`);
      console.error(`   2. Check if user exists in MongoDB Atlas`);
      console.error(`   3. Verify IP whitelist includes your machine`);
      console.error(`   4. Make sure password doesn't have unencoded special characters\n`);
    }

    process.exit(1);
  }
};

module.exports = connectDB;