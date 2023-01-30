import { Schema,Document,model } from 'mongoose';

interface IPost extends Document{
    user_id: string;
    post_input: string;
    created_at: string;
  }

const postSchema : Schema = new Schema({
    user_id :{
        type: String,
        required : true
    },
    post_input: {
        type: String,
        required: true
    },
    created_at_standart: {
        type: String,
        required : true
  },
  created_at_timestamp: {
    type: Number,
    required: true
  }
  });

const Posts = model<IPost>('Posts',postSchema);
export default Posts;
  


