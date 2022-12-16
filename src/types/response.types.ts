export interface IResponse {
    status: number;
    message: any;
}

export interface ISuccessResponse extends IResponse {
    data: any;
}

export interface IErrorResponse extends IResponse {
    code: number
}