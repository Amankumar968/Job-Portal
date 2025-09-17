import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('✅ Database Connected'));

  // Do NOT append /job-portal again because URI already has it
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
