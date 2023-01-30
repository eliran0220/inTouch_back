import { Schema,Document,model } from 'mongoose';

interface IUser extends Document{
    email: string;
    first_name?: string;
    last_name?: string;
    full_name: string;
    password: string;
    created_at: string;
  }

const userSchema : Schema = new Schema({
    email :{
        type: String,
        required : true
    },
    full_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
  created_at: {
        type: String,
        required : false
  }
  });

const User = model<IUser>('Users',userSchema);
export default User;
  


