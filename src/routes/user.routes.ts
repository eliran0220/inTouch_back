const user_routes = [
    {method : "post", url : "/v1/user/signup", action : "createUser",controller : "UserController"},
    {method : "get", url : "/v1/user/logout", action : "logout",controller : "UserController"},
    {method : "get", url : "/v1/user/authenticate", action : "isAuthenticated",controller : "AuthorizationController"},
    {method : "get", url : "/v1/user/:id", action : "getUser", controller : "UserController"},
    {method : "get", url : "/v1/user/getUsers/:full_name", action : "getUsers", controller : "UserController"},
    {method : "delete", url : "/v1/user/:user_id", action : "deleteUser",controller : "UserController"},
    {method : "post", url : "/v1/user/login", action : "login",controller : "UserController"},
    
];

export default user_routes;
