
import mongoose from 'mongoose';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL as string;
console.log(databaseUrl);
export const connectToDatabase = () => {

  mongoose.connect(databaseUrl);

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
}