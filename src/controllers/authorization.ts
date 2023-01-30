import logger from "../utilities/logger";
import {Response, Request} from "express";
import AuthorizationService from '../services/authorization';
import {IResponse } from "../types/response.types";
class AuthorizationController {
    async isAuthenticated(req: Request, res: Response) {
        const func_name ='AuthorizationController/isAuthenticated';
        logger.info(func_name,'start');
        const token = req.cookies['x-token'];
        let error: IResponse;
        if (!token) {
            error = {
                status: 400,
                message: `Token not found`,
                data: null,
                code: 1
            }
            logger.info(func_name,'end',error);
            return res.json(error)
        } else {
            let result;
            try {
                result = await AuthorizationService.isAuthenticated(token)
                if(result) {
                    const response : IResponse = {
                        status: 200,
                        message: `Token saved`,
                        data: result,
                        code: 1
                    }
                    res.cookie("x-token", result, {
                        httpOnly: true,
                      });
                    logger.info(func_name,'end',response.data);
                    res.json(response);
                } else {
                    const error: IResponse = {
                        message: 'No token',
                        status: 400,
                        code: 0,
                        data: false
                    }
                    res.clearCookie('x-token');
                    logger.info(func_name,'end',error);
                    res.json(error);
                }
            } catch (err) {
                res.clearCookie('x-token')
                logger.error(func_name,'err',{});
                throw err;
            }
        }
    }
}
export default new AuthorizationController();
