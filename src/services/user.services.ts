import {IUser} from '../types/request.types';
import {IUserDto} from '../types/dto.types'
import * as process from 'process'
import * as db_service from './db.user.services';
import moment from 'moment';
import {validateEmail, validateUser,validatePassword} from '../validator/user.validator';
import {STATUS_CODES,VALDIATION_ERRORS,BAD_REQUEST_ERRORS} from '../utilities/constants.utilities';
import { hashUserPassword, generateJwt } from '../utilities/common.utils';
import {Jwt, JwtPayload, VerifyOptions,verify} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '../utilities/logger';
import { IErrorResponse } from '../types/response.types';

class UserService {
    private module_name: string

    constructor() {
        console.log('Created instance of UserService');
        this.module_name = "UserService"
    }

    async createUser(user : IUser) {
        const func_name = `UserService/createUser`;
        logger.info(func_name,'start',user);
        let error_response : IErrorResponse;
        try {
            validateUser(user);
            const user_in_db = await db_service.getUser(user.email);
            if (user_in_db) {
                error_response = {
                    message: `${user.email} ${BAD_REQUEST_ERRORS.USER_FOUND}`,
                    status:STATUS_CODES.BAD_REQUEST,
                    code: 1
                }
                throw error_response;
            };
            user.password = await hashUserPassword(user.password);
            const token = generateJwt(user.email,user.password) as string;
            const new_user : IUserDto = {
                ...user,
                created_at : moment().format("DD/MM/YYYY"),
            };
            const created_user = await db_service.createUser(new_user);
            await db_service.saveUserLoginToken(new_user.email,token);
            logger.info(func_name,'end',created_user as IUserDto);
            return created_user;
        }
        catch (err: any) {
            console.log(err)
            logger.error(func_name,'err',err);
            throw err;
        }
    }
    
    async getUser(email : string) : Promise<IUser | null>  {
        const func_name = `UserService/getUser`;
        let result : IUser;
        logger.info(func_name,'start',email);
        try {
            if (!validateEmail(email)) {
                const error: IErrorResponse = {
                    message: VALDIATION_ERRORS.INVALID_EMAIL,
                    status: 400,
                    code: 0
                }
                throw error;
            }
            result = await db_service.getUser(email) as IUser;
        } catch (err: any) {
            logger.error(func_name,'Error error at catch',err);
            throw err;
        }
        logger.info(func_name,'end',email);
        return result;
    }

    async verifyToken(token : string) {
        const func_name = `UserService/verifyToken`;
        let verified: string | Jwt | JwtPayload;
        logger.info(func_name,'start',token);
        try {
            const TOKEN_KEY = process.env.TOKEN_KEY;
            if (!TOKEN_KEY) throw "No proccess token!";
            const verifyOptions: VerifyOptions = {
                algorithms: ['RS256'],
            };
            verified = await verify(token,TOKEN_KEY,verifyOptions);
        } catch (err: any) {
            logger.error(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',verified);
        return verified;
    }
    
    async login(email : string , password : string){
        const func_name = `UserService/login`;
        logger.info(func_name,'start',{email: email, password: password});
        let result: string = '';
        try {
            validatePassword(password);
            const user : IUserDto = await this.getUser(email) as IUserDto;
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) throw "Passwords don't match!"
            const token = generateJwt(user.email,user.password) as string;
            logger.info(func_name,'result',token);
            logger.info(func_name,'end');
            await db_service.saveUserLoginToken(user.email,token);
            result = token;
        } catch (err: any) {
            logger.error(func_name,'error at catch',err);
            throw err;
        }
        logger.info(func_name,'end',result);
        return result;
        }
    }

const userService = new UserService();
export default userService;