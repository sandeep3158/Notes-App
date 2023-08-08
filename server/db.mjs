import { connect } from 'mongoose';
const mongoURI =process.env.DATABASE_URL


const connectToMongo = async () => {
  try {
    await connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

export default connectToMongo;
