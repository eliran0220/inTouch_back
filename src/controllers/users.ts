import {Response, Request} from "express";
import {IUser} from '../types/request.types';
import logger from '../utilities/logger';
import UserService from '../services/user';
import {IResponse } from "../types/response.types";

class UserController {
    constructor() {
        logger.info("UserController","has been created");
    }    
    async getUser(req: Request, res: Response) {
        const func_name = `UserController/getUser`;
        let user;
        logger.info(func_name,'start',req.params.id);
        try {
            const id = req.params.id;
            user = await UserService.getUser(id);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',user);
        res.json(user);
    }

    async getUsers(req: Request, res: Response) {
        const func_name = `UserController/getUser`;
        let user;
        logger.info(func_name,'start',req.params.full_name);
        try {
            const full_name = req.params.full_name;
            user = await UserService.getUsers(full_name);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',user);
        res.json(user);
    }


    async createUser(req: Request, res: Response) {
        const func_name = `UserController/createUser`;
        logger.info(func_name,'start',req.body);
        let result : IResponse;
        try {
            const response = await UserService.createUser(req.body as IUser);
            if(response.data) {
                res.cookie("x-token", response.data, {
                    httpOnly: true,
                  });
            }
            result = response;
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',result);
        res.json(result);    
    }

    async deleteUser(req: Request, res: Response) {
        const func_name = `UserController/deleteUser`;
        res.json({message:'User route delete request'})
    }
    async login(req: Request, res: Response) {
        const func_name = `UserController/login`;
        logger.info(func_name,'start',{email: req.body.email});
        try {
            const {email, password} = req.body;
            const result = await UserService.login(email,password);
            if(result.data) {
                res.cookie("x-token", result.data.access_token, {
                    httpOnly: true,
                  });
            }
            result.data.access_token = '';
            logger.info(func_name,'end',result.data);
            res.json(result);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
    }

    async logout(req: Request, res: Response) {
        const func_name = `UserController/logout`;
        logger.info(func_name,'start');
        try {
            const token = req.cookies['x-token'];
            const result = await UserService.logout(token);
            if(result) {
                res.clearCookie('x-token')
            }
            logger.info(func_name,'end');
            res.json(result);
        } catch (err: any) {
            logger.info(func_name,'err',err);
            throw err;
        }
    }

}
const userController = new UserController();

export default userController;