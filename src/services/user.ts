import {IUser} from '../types/request.types';
import {IUserDto} from '../types/dto.types'
import * as process from 'process'
import * as db_service from './db';
import moment from 'moment';
import {validateEmail, validateUser} from '../validator/user.validator';
import {STATUS_CODES,VALDIATION_ERRORS,BAD_REQUEST_ERRORS, SUCCESS_MESSAGES} from '../utilities/constants.utilities';
import { hashUserPassword, generateJwt } from '../utilities/common.utils';
import {Jwt, JwtPayload, VerifyOptions,verify} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '../utilities/logger';
import {IResponse} from '../types/response.types';

class UserService {
    constructor() {
        logger.info('UserService','has been created');
    }

    async createUser(user : IUser) {
        const func_name = `UserService/createUser`;
        logger.info(func_name,'start',user);
        let response : IResponse
        let error_acumalator;
        try {
            error_acumalator = validateUser(user);
            if(error_acumalator) return error_acumalator;
            const user_in_db = await db_service.getUser(user.email);
            if (user_in_db) {
                response = {
                    message: `${user.email} ${BAD_REQUEST_ERRORS.USER_FOUND}`,
                    status:STATUS_CODES.BAD_REQUEST,
                    code: 1,
                    data: null
                }
                return response;
            };
            user.password = await hashUserPassword(user.password);
            const new_user : IUserDto = {
                created_at: moment().format("DD/MM/YYYY"),
                email: user.email,
                full_name: user.first_name + ' ' + user.last_name,
                password: user.password
            };
            const created_user = await db_service.createUser(new_user);
            logger.info(func_name,'end',created_user as IUserDto);
            response = {
                message: `${user.email} ${SUCCESS_MESSAGES.USER_CREATED}`,
                status:STATUS_CODES.OK,
                code: 1,
                data: "REGISTERED",
            }
            return response;
        }
        catch (err: any) {
            console.log(err)
            logger.error(func_name,'err',err);
            throw err;
        }
    }
    
    async getUser(email : string)   {
        const func_name = `UserService/getUser`;
        let result;
        let response: IResponse
        logger.info(func_name,'start',email);
        try {
            if (!validateEmail(email)) {
                 response = {
                    message: VALDIATION_ERRORS.INVALID_EMAIL,
                    status: STATUS_CODES.BAD_REQUEST,
                    code: 1,
                    data: null
                }
            } else {
                result = await db_service.getUser(email) as IUserDto;
                if (result){
                    response = {
                        message: SUCCESS_MESSAGES.GET_USER,
                        status: STATUS_CODES.OK,
                        code: 1,
                        data: result     
                    }
                } else {
                    response = {
                        message: BAD_REQUEST_ERRORS.USER_N0T_FOUND,
                        status: STATUS_CODES.BAD_REQUEST,
                        code: 1,
                        data: null     
                    }
                }
            } 
        }catch (err: any) {
            logger.error(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',result);
        return response;
    }

    async getUsers(full_name: string) {
        const func_name = `UserService/getUsers`;
        let result;
        let response: IResponse
        logger.info(func_name,'start',full_name);
        try {
            result = await db_service.getUsers(full_name);
            result = result.map((user: IUserDto) => {
                user.password = '';
                return user;
            })
            response = {
                message: SUCCESS_MESSAGES.GET_USER,
                status: STATUS_CODES.OK,
                code: 1,
                data: result     
            }
            
        } catch (err : any) {
            logger.error(func_name,'err',err);
            throw err;
        }
        logger.info(func_name,'end',result);
        return response;
    }

    async verifyToken(token : string,type: string): Promise<JwtPayload | null> {
        const func_name = `UserService/verifyToken`;
        let verified: string | Jwt | JwtPayload;
        let TOKEN_KEY;
        logger.info(func_name,'start',token);
        try {
            if (type === 'access'){
                TOKEN_KEY = process.env.TOKEN_KEY;
            } else {
                TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
            }
            console.log(TOKEN_KEY)
            if (!TOKEN_KEY) throw "No proccess token!";
            const verifyOptions: VerifyOptions = {
                algorithms: ['HS256'],
            };
            verified = await verify(token,TOKEN_KEY,verifyOptions) as JwtPayload;
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
        let result: IResponse;
        let error: IResponse;
        try {
            const user = await db_service.getUser(email) as IUserDto;
            console.log("got user")
            if (!user) {
                error = {
                    message: `${email} BAD_REQUEST_ERRORS.USER_N0T_FOUND}`,
                    status: STATUS_CODES.BAD_REQUEST,
                    code: 1,
                    data: null
                }
                console.log(error)
                return error;
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                error = {
                    message: `VALDIATION_ERRORS.PASSWORD_DOESNT_MATCH ${email}`,
                    status: STATUS_CODES.BAD_REQUEST,
                    code: 1,
                    data: null
                }
                return error;
            }
            console.log("going to generate tokens")
            const access_token = generateJwt(user.email,user.password,'1d','access') as string;
            const refresh_token = generateJwt(`${user.email}`,`${user.password}`,'30d','refresh') as string;
            logger.info(func_name,'end - result',{access_token,refresh_token});
            await db_service.saveUserLoginToken(access_token,refresh_token);
            result = {
                status: STATUS_CODES.OK,
                message: `${email}${SUCCESS_MESSAGES.GET_USER}`,
                data: {access_token: access_token, full_name: `${user.full_name}`, obj_id: user._id, user_id: user._id},
                code: 1
            }
        } catch (err: any) {
            logger.error(func_name,'error',err);
            throw err;
        }
        logger.info(func_name,'end',result);
        return result;
        }

        async logout(access_token: string) {
            const func_name = `UserService/logout`;
            logger.info(func_name,'start',{access_token: access_token});
            try {
                await db_service.deleteUserLoginToken(access_token);
                return true;
            } catch (err) {
                logger.error(func_name,'error',err);
                throw err;
            }
        }

        async post(user_id: string, post_input: string) {
            const func_name = `UserService/post`;
            logger.info(func_name,'start',{user_id:user_id,post_input: post_input});
            try {
                const created_at = await db_service.savePost(user_id,post_input);
                return created_at;
            } catch (err) {
                logger.error(func_name,'error',err);
                throw err;
            }
        }

    }

const userService = new UserService();
export default userService;