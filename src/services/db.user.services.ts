import {IUserDto} from '../types/dto.types';
import User from '../odels/user';
import UserToken from '../odels/user_tokens';
import logger from '../utilities/logger';
import { IUser } from '../types/request.types';
import {STATUS_CODES,GENERAL_ERRORS,BAD_REQUEST_ERRORS} from '../utilities/constants.utilities';
import { IErrorResponse } from '../types/response.types';
export const createUser = async (user : IUserDto) : Promise<IUserDto | null> => {
    const func_name = `DbUserService/createUser`;
    logger.info(func_name,'start',user);
    let result : IUserDto;
    try {
        const new_user = new User({
            email : user.email,
            first_name : user.first_name,
            last_name: user.last_name,
            password: user.password,
            created_at: user.created_at
        })
        await new_user.save();
        result = new_user;
    } catch (err) {
        logger.error(func_name,"err",err);
        const error : IErrorResponse = {
            message: "Error saving user at db",
            status: 500,
            code: 0
        }
        throw error;
    }
    logger.info(func_name,'end',result);
    return result;
}

export const getUser = async (email : string) : Promise<IUser | null> => {
    const func_name = `DbUserService/getUser`;
    logger.info(func_name,'start',email);
    let error: IErrorResponse;
    let result : IUserDto;
    try {
        const user = await User.findOne({email : email}) as IUserDto;
        result = user;
    } catch (err) {
        logger.error(func_name,"err",err);
        error = {
            message :`${email} ${BAD_REQUEST_ERRORS.USER_N0T_FOUND}`,
            status: 500,
            code: 1
        };
        throw error;
    }
    logger.info(func_name,'end',result);
    return result;
}

export const saveUserLoginToken = async (email : string ,token : string) : Promise<void> => {
    const func_name = `DbUserService/saveUserLoginToken`;
    logger.info(func_name,'start',{email:email, token: token});
    let error :  IErrorResponse;
    try {
        const user_token = await UserToken.findOne({email : email});
        if (!user_token) {
            const new_token = new UserToken({email: email, token: token})
            await new_token.save();
        }
    }
    catch (err: any) {
        error = {
            message: GENERAL_ERRORS.ERROR_SAVING_USER_TOKEN,
            status: 500,
            code: 0
        }
        logger.error(func_name,"err",err)
        throw err;
    }
    logger.info(func_name,'end');
}