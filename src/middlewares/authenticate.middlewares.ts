import jwt from 'jsonwebtoken';
import * as process from 'process';
import {Request,Response,NextFunction} from 'express';
import { IResponse } from '../types/response.types';

const verifyToken = async (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers["x-token"];
    if (!token) {
        const response : IResponse = {
            status : 403,
            message : 'Access denied, please login',
            code:0
        }
        res.json(response).status(response.status);
        next();
    }
    try {
        const TOKEN_KEY = process.env.TOKEN_KEY;
        if (!TOKEN_KEY) throw "Token error!";
        const result = await jwt.verify(token as string,TOKEN_KEY);
        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};

export default verifyToken;