import * as mongoose from 'mongoose';

const uri = "mongodb+srv://eliran0220:iznmpqilovesA123@cluster0.jzok7.mongodb.net/?retryWrites=true&w=majority";

export const connectDatabase = async () => {
    try {
      await mongoose.connect(uri);
      console.log("connected to database");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  