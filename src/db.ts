import mongoose, { ConnectOptions } from 'mongoose';



export const connectToDatabase = () => {
  const databaseUrl = "mongodb+srv://ulysses:sistema1@db.jljvffc.mongodb.net"; 


  const connectOptions: ConnectOptions = {};

  mongoose.connect(databaseUrl, connectOptions);

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};