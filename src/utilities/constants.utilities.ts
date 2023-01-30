
export const REGEX = {
    "valid_password" : new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$"),
    "valid_email" : new RegExp("^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
};

export enum VALDIATION_ERRORS {
    INVALID_PASSWORD = 'The minimum is 8 characters which consist at least 1 lowercase, 1 uppercase, 1 special character',
    INVALID_EMAIL = 'Please enter an email with the format : example@somemail.domain',
    INVALID_USERNAME_EMPTY = 'Please enter a username of characters',
    INVALID_PASSWORD_EMPTY = 'Please enter a password of characters',
    INVALID_EMAIL_EMPTY = 'Please enter a email of characters',
    INVALID_FIRSTNAME_EMPTY = 'Please enter a firstname of characters',
    INVALID_LASTNAME_EMPTY = 'Please enter a lastname of characters',
    PASSWORD_DOESNT_MATCH = "Password is incorrect for "
}

export enum SUCCESS_MESSAGES {
    USER_CREATED = " has been created succesfully",
    USER_LOGGED = " has been logged in succesfully",
    GET_USER = " has been retrieved from db succesfully"
}


export enum BAD_REQUEST_ERRORS {
    USER_N0T_FOUND = " was not found",
    USER_FOUND = " with this email already exists",
}

export enum GENERAL_ERRORS {
    GENERAL_ERROR = "General error occured",
    HASH_ERROR = "Hash error",
    TOKEN_ERROR = "Cannot create jwt token",
    ERROR_SAVING_USER_TOKEN = "Error saving user token",
    DATABASE_ERROR = "DB error occured"
}

export enum STATUS_CODES {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    DATABASE_ERROR = 500,
    GENERAL_ERROR = 500,
    OK = 200
}

export const MANDATORY_FIELDS = ["email","password"];

export const GEN_SALT = 10;

