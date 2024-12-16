import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0, // Default quantity is 0
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const userItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Links to the User collection
    ref: "Students", // Reference to the User model
    required: true,
    unique: true, // Ensures a unique set of items per user
  },
  items: {
    type: [itemSchema], // An array of item objects
    default: [],
    required: true,
  },
});

// Prevent model overwrite during hot reloads
const UserItem = mongoose.models.UserItem || mongoose.model("UserItem", userItemSchema);

export default UserItem;
