import express, {Express} from 'express';
import cors from 'cors';
import dotenv  from 'dotenv';
import * as utilities from '../utilities/common.utils';
import * as process from "process";
import {addIDToRequest} from '../middlewares/operationId.middleware';
import {routeBuilder} from '../utilities/common.utils';
import {connectDatabase} from '../utilities/db.utilities';
import cookieParser from 'cookie-parser';

class App {
    private readonly app : Express;
    constructor() {
        dotenv.config({path:'./.env'});
        this.app = express();
        this.initMiddlewares();
        this.initRoutes();
        connectDatabase();
    }

    initMiddlewares() : void {
        this.app.use(cors({origin:'http://localhost:3000',credentials:true}));
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(addIDToRequest);
    }

    
    initRoutes() : void {
        for (const route of utilities.routes) {
            routeBuilder(this.app,route);
        }
    }

    get appInstance(): Express {
        return this.app;
    }

    startServer() : void {
        this.app.listen( process.env.APP_PORT, () => {
            console.log( `server started at http://localhost:${process.env.APP_PORT}` );
        } );
    }
}

const instance = new App();
export default instance;

