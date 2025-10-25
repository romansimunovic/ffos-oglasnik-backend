import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB uspješno povezan");
  } catch (error) {
    console.error("Povezivanje s bazom podataka nije uspjelo:", error.message);
    process.exit(1);
  }
};

export default connectDB;
