// import mongoose from "mongoose";

// // Function to connect to the MongoDB database
// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log('Database Connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)

// }

// export default connectDB
// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Event listener for successful connection
    mongoose.connection.on('connected', () => console.log('✅ Database Connected'));

    // Connect to MongoDB Atlas (do NOT append /job-portal here)
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
