import {IUserDto,IUserTokenDto} from '../types/dto.types';
import User from '../models/user';
import Posts from '../models/posts';
import UserToken from '../models/user_tokens';
import logger from '../utilities/logger';
import {GENERAL_ERRORS, STATUS_CODES} from '../utilities/constants.utilities';
import { IResponse } from '../types/response.types';
import moment from 'moment';
import { ObjectId } from 'mongodb';

export const createUser = async (user : IUserDto) : Promise<IUserDto | null> => {
    const func_name = `DbService/createUser`;
    logger.info(func_name,'start',user);
    let result : IUserDto;
    try {
        const new_user = new User({
            email : user.email,
            full_name : user.full_name,
            password: user.password,
            created_at: user.created_at
        })
        await new_user.save();
        result = new_user;
    } catch (err) {
        logger.error(func_name,"err",err);
        const error : IResponse = {
            message: "Error saving user at db",
            status: 500,
            code: 2
        }
        throw error;
    }
    logger.info(func_name,'end',result);
    return result;
}

export const getUser = async (email : string) : Promise<IUserDto | null> => {
    const func_name = `DbService/getUser`;
    logger.info(func_name,'start',email);
    let error: IResponse;
    let result : IUserDto;
    try {
        const user = await User.findOne({email : email}) as IUserDto;
        result = user;
        logger.info(func_name,"db result",result);
    } catch (err) {
        logger.error(func_name,"err",err);
        error = {
            message :`${GENERAL_ERRORS.DATABASE_ERROR}`,
            status: STATUS_CODES.DATABASE_ERROR,
            code: 1
        };
        throw error;
    }
    logger.info(func_name,'end',result);
    return result;
}

export const getUsers = async (full_name : string) => {
    const func_name = `DbService/getUser`;
    logger.info(func_name,'start',full_name);
    let error: IResponse;
    let result
    try {
         result = await User.find({ full_name: {$regex : full_name}}) as IUserDto[];
        logger.info(func_name,"db result",result);
    } catch (err) {
        logger.error(func_name,"err",err);
        error = {
            message :`${GENERAL_ERRORS.DATABASE_ERROR}`,
            status: STATUS_CODES.DATABASE_ERROR,
            code: 1
        };
        throw error;
    }
    logger.info(func_name,'end',result);
    return result;
}

export const saveUserLoginToken = async (access_token : string ,refresh_token : string) : Promise<void> => {
    const func_name = `DbService/saveUserLoginToken`;
    logger.info(func_name,'start',{access_token:access_token, refresh_token: refresh_token});
    let error :  IResponse;
    try {
        const user_token = await UserToken.findOne({access_token : access_token});
        if (!user_token) {
            const new_token = new UserToken({access_token: access_token, refresh_token: refresh_token})
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
        throw error;
    }
    logger.info(func_name,'end');
}

export const getRefreshToken = async (access_token: string) : Promise<string | null> => {
    const func_name = `DbService/getRefreshToken`;
    logger.info(func_name,'start',{access_token:access_token});
    try {
        const refresh_token = await UserToken.findOne({access_token : access_token}) as IUserTokenDto;
        if (!refresh_token) {
            return null;
        }
        return refresh_token.refresh_token;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const deleteUserLoginToken = async (access_token: string) => {
    const func_name = `DbService/deleteUserLoginToken`;
    logger.info(func_name,'start');
    try {
        await UserToken.deleteOne({access_token : access_token});
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const updateUserAccessToken = async (old_access_token: string, new_access_token: string, refresh_token: string) => {
    const func_name = `DbService/updateUserAccessToken`;
    logger.info(func_name,'start');
    try {
        const res = await UserToken.findOneAndUpdate(
            {access_token : old_access_token},
            {access_token: new_access_token,refresh_token: refresh_token});
            console.log(res)
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const savePost = async (user_id: string, post_input: string) => {
    const func_name = `DbService/savePost`;
    logger.info(func_name,'start');
    try {
        const post = await new Posts({user_id: user_id, post_input: post_input,created_at_standart: moment().format("DD/MM/YYYY"),created_at_timestamp: Date.now() });
        await post.save();
        return post;
    } catch (err) {
        console.log(err)
    }
}

export const getUserPosts = async (user_id: string) => {
    const func_name = `DbService/getUserPosts`;
    logger.info(func_name,'start');
    try {
        const posts = await Posts.find({user_id: user_id})
        console.log(posts)
        const user = await User.findOne(new ObjectId(user_id));
        return {user: user, posts:posts};
    } catch (err) {
        console.log(err)
    }
}