import { Schema,Document,model } from 'mongoose';

interface IUserToken extends Document{
  access_token: string;
  refresh_token: string
  }

const userSchema : Schema = new Schema({
    access_token :{
        type: String,
        required : true
    },
    refresh_token: {
        type: String,
        required: true
    }
  });

const UserToken = model<IUserToken>('Users_Tokens',userSchema);
export default UserToken;
  


