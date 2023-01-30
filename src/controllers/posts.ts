import {Response, Request} from "express";
import logger from '../utilities/logger';
import PostsService from '../services/posts';


class PostsController {
    constructor() {
        logger.info("PostsController","has been created");
    }    

    async getUserPosts(req: Request, res: Response) {
        const func_name = `PostsController/getUserPosts`;
        logger.info(func_name,'start');
        try {
            const user_id = req.params.user_id;
            const result = await PostsService.getUserPosts(user_id);
            res.json(result);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
    }

    async post(req: Request, res: Response) {
        const func_name = `PostsController/post`;
        logger.info(func_name,'start');
        try {
            const result = await PostsService.post(req.params.user_id,req.body.post_input);
            res.json(result);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
    }
}

const postsController = new PostsController();
export default postsController;