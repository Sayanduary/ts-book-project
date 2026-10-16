import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const connect_db: () => Promise<void> = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Database Connection Sucessfull");
  } catch (error: any) {
    console.log("error connecting with db", error);
    process.exit(1);
  }
};
