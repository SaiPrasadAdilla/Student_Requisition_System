import mongoose from 'mongoose';
import colors from 'colors';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true
    });
    console.log(`Connected to Mongo Database: ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`Error in MongoDB: ${error.message}`.bgRed.white);
    process.exit(1); // Exiting the process if the DB connection fails
  }
};

export default connectDb;
