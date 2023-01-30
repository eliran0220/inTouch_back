import {Request,Response,NextFunction} from 'express';
type AsyncReqHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default AsyncReqHandler;