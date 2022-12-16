import {Response, Request} from "express";
import {IUser} from '../types/request.types';
import {IUserDto} from '../types/dto.types';
import logger from '../utilities/logger';
import UserService from '../services/user.services';
import {ISuccessResponse } from "../types/response.types";

import {SUCCESS_MESSAGES} from '../utilities/constants.utilities'; 
class UserController {
    constructor() {
        logger.info("UserController","has been created");
    }
    
    async getUser(req: Request, res: Response) {
        const func_name = `UserController/getUser`;
        let result : ISuccessResponse;
        logger.info(func_name,'start',req.params.id);
        try {
            const id = req.params.id;
            const user = await UserService.getUser(id) as IUserDto;
            const response : ISuccessResponse = {
                status:200,
                message : `${user.email}${SUCCESS_MESSAGES.GET_USER}`,
                data : user
            };
            result = response;
        } catch (err: any) {
            logger.info(func_name,'err',err);
            res.status(400).json(err);
            return;
        }
        logger.info(func_name,'end',result.data);
        res.status(result.status).json(result);
    }

    async createUser(req: Request, res: Response) {
        const func_name = `UserController/createUser`;
        let result : ISuccessResponse;
        try {
            const created_user = await UserService.createUser(req.body as IUser) as IUserDto;
            const response : ISuccessResponse = {
                status:200,
                message : `${created_user.email}${SUCCESS_MESSAGES.USER_CREATED}`,
                data : created_user
            };
            result = response;
        } catch (err: any) {
            logger.info(func_name,'err',err);
            res.status(400).json(err);
            return;
        }
        logger.info(func_name,'end',result.data);
        res.status(result.status).json(result);    
    }

    async deleteUser(req: Request, res: Response) {
        const func_name = `UserController/deleteUser`;
        res.json({message:'User route delete request'})
    }
    async login(req: Request, res: Response) {
        const func_name = `UserController/login`;
        logger.info(func_name,'start',{email: req.body.email});
        let result : ISuccessResponse;
        try {
            const {email, password} = req.body;
            const token = await UserService.login(email,password);
            const response : ISuccessResponse = {
                status: 200,
                message: `${email}${SUCCESS_MESSAGES}`,
                data: token
            }
            result = response;
        } catch (err: any) {
            logger.info(func_name,'err',err);
            res.status(400).json(err);
            return;
        }
        logger.info(func_name,'end',result.data);
        res.status(result.status).json(result);
    }
}
const userController = new UserController();

export default userController;