import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB uspješno povezan");
    console.log("📦 Baza:", mongoose.connection.name);
    console.log("📁 Kolekcije:", Object.keys(mongoose.connection.collections));
  } catch (err) {
    console.error("❌ Mongo connect fail:", err.message);
    process.exit(1);
  }
};

export default connectDB;
