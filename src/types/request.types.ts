export interface IUser {
    email: string,
    password: string,
    first_name: string,
    last_name: string,
};

export interface ILogin {
    email : string,
    password : string,
};

export interface IPost {
    title : string,
    created_at : string,
};

export type paramChecker = IUser | ILogin;


