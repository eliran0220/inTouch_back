import logger from "../utilities/logger";
import UserService from './user';
import { IResponse } from "../types/response.types";
import * as DbService from './db';
import {generateJwt} from '../utilities/common.utils';
class AuthorizationService {
    async isAuthenticated(token: any){
        const func_name ='AuthorizationService/isAuthenticated';
        logger.info(func_name,'start');
        let refresh_token: string | null;
        let access_token: string | null = "";
        if (!token) return false;
        logger.info(func_name,'token is',token);
        const current_date = Date.now();
        const verified = await UserService.verifyToken(token,'access');
        if (verified?.exp&& verified.exp > current_date) {
           refresh_token = await this.getRefreshToken(token);
            if (!refresh_token) {
                console.log("No refresh token")
                return false;
            }
            const verified_rt = await UserService.verifyToken(refresh_token,'refresh');
            if (verified_rt?.exp && verified_rt.exp > current_date){
                console.log("refresh token expired, login")
                return false;
            }
            access_token = generateJwt(`${verified.email}`,`${verified.password}`,'1d','access') as string;
            console.log("access",access_token)
            await DbService.updateUserAccessToken(token,access_token,refresh_token);
            console.log("verified")
            return access_token;
        } else {
            if (verified) {
                console.log("verified")
                access_token = generateJwt(`${verified.email}`,`${verified.password}`,'1d','access') as string;
                
                return access_token;
            }
        }
    }

    async getRefreshToken(access_token: string): Promise<string | null>{
        const func_name ='AuthorizationService/getRefreshToken';
        logger.info(func_name,'start');
        let result;
        let error: IResponse;
        try {
            const refresh_token = await DbService.getRefreshToken(access_token);
            if (!refresh_token) {
                return null;
            }
            result = refresh_token;
        } catch (err) {
            error = {
                message: 'Error getting refresh key',
                status: 500,
                code: 0
            }
            logger.error(func_name,'err',{});
            throw error;
        }
        logger.info(func_name,'end');
        return result;
    }
}

const authorizationController = new AuthorizationService();

export default authorizationController;