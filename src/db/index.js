import mongoose from 'mongoose';
import {DB_URL}from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_URL}`, {
    });
    console.log(`MONGODB CONNECTED: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MONGODB DEH GYA🤬🤬🤬', error);
    process.exit(1);
    }
}

export default connectDB;