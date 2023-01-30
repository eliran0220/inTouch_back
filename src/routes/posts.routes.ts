const posts_routes = [
    {method : "get", url : "/v1/posts/:user_id", action : "getUserPosts", controller : "PostsController"},
    {method : "post", url : "/v1/post/:user_id", action : "post",controller : "PostsController"},
    {method : "delete", url : "/v1/posts/:post_id", action : "deletePost",controller : "PostsController"}

];

export default posts_routes;
