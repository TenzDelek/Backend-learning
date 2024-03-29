import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
//connecting with the mongodb
const connectDB = async () => {
  try {
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`)
} catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
    //process is from node
  }
};

export default connectDB
