import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;  // Check if this is loaded correctly
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,  // 30 seconds
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectMongoDB;
