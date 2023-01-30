export interface ErrorAcumalator {
    [key : string] : string
}

export interface Route {
    method : string,
    url : string,
    action : string,
    controller: string,
    middlewares? : Function[]
}

export interface Logger {
    info(module: string, message: string, params? : Object);
    error(module: string, message: string, err: ErrorConstructor);
}
