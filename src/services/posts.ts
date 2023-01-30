import logger from '../utilities/logger';
import * as process from 'process'
import * as db_service from './db';
import { IResponse } from '../types/response.types';
import { STATUS_CODES, SUCCESS_MESSAGES } from '../utilities/constants.utilities';
import { IPostDto } from '../types/dto.types';

class PostsService {
    constructor() {
        logger.info('UserService','has been created');
    }

    async getUserPosts(user_id: string) {
        let response: IResponse
        const func_name = `PostsService/getUserPosts`;
        console.log(func_name)
        try {
            const {user,posts} = await db_service.getUserPosts(user_id) as any;
            response = {
                message: `ALL POSTS RETRIEVED`,
                status:STATUS_CODES.OK,
                code: 1,
                data: {user: user, posts: posts}
            }
            logger.info(func_name,'end');
            return response;
        } catch (err) {
            logger.error(func_name,'err',err);
            throw err;
        }
    }

    async post(user_id: string, post_input: string) {
        const func_name = `PostsService/post`;
        logger.info(func_name,'start',{user_id: user_id,post_input: post_input});
        try {
            const post = await db_service.savePost(user_id,post_input);
            return post;
        } catch (err) {
            logger.error(func_name,'error',err);
            throw err;
        }
    }


}

const postsService = new PostsService();
export default postsService;