export interface IUserDto {
    _id?: string,
    email : string,
    full_name : string,
    password : string,
    created_at : string
}


export interface IUserTokenDto {
    id?: string,
    access_token: string,
    refresh_token: string
}

export interface IPostDto {
    _id: string,
    user_id: string,
    first_name: string,
    last_name: string,
    post_input: string,
    created_at: string
}