import {Express,Request,Response,NextFunction,RequestHandler} from 'express';
import user_routes from '../routes/user.routes';
import posts_routes from '../routes/posts.routes'
import UserController from '../controllers/users';
import PostsController from '../controllers/posts';
import AuthorizationController from '../controllers/authorization';
import * as utilitis from '../utilities/common.utils';
import {Route} from '../types/common.types'
import AsyncReqHandler from '../types/catcher.types';
import bcrypt from 'bcrypt';
import {GEN_SALT} from '../utilities/constants.utilities';
import { sign, SignOptions } from 'jsonwebtoken';
import * as process from "process";
import { IResponse } from '../types/response.types';
import {STATUS_CODES,GENERAL_ERRORS} from '../utilities/constants.utilities';
export const routes = [...user_routes,...posts_routes];

export const controllersMapping = {
    "UserController" : UserController,
    "PostsController" : PostsController,
    "AuthorizationController" : AuthorizationController
};


export const routeBuilder = (app : Express,route : Route) : void => {
    const {method, url, action, controller,middlewares} = route;
    const Controller = utilitis.controllersMapping[controller];
    middlewares ? app.route(url)[method](...middlewares,errorWrapper(Controller[action])) : app.route(url)[method](errorWrapper(Controller[action]));
}


export default function errorWrapper(routingFunc: AsyncReqHandler | RequestHandler):AsyncReqHandler {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await routingFunc(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

export const hashUserPassword = async (password : string) => {
    let hashed_password : string = '';
    let error : IResponse;
    try{
        const salt = await bcrypt.genSalt(GEN_SALT);
        hashed_password = await bcrypt.hash(password,salt);
    } catch (err) {
        error = {
            message: GENERAL_ERRORS.TOKEN_ERROR,
            status: STATUS_CODES.GENERAL_ERROR,
            code: 0
        }
        throw error;
    }
    return hashed_password;
}

export const generateJwt = (email : string, password : string, timespan: string, type: string) =>{
    try {
        let token_key: string | undefined = '';
        if (type === 'access'){
            token_key = process.env.TOKEN_KEY;
        } else {
            token_key = process.env.REFRESH_TOKEN_KEY;
        }
        console.log(token_key)
        const payload = {
            email: email,
            password: password,
        };
        const TOKEN_KEY = token_key;
        const signInOptions: SignOptions = {
            algorithm: 'HS256',
            expiresIn: timespan
        };
        if (TOKEN_KEY) return sign(payload,TOKEN_KEY,signInOptions)
    } catch(err) {
        const response : IResponse = {
            message: GENERAL_ERRORS.HASH_ERROR,
            status: 500,
            code: 0
        }
        throw response;
    }

}

                                


