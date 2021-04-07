const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate({
        path: 'user',
        select: '-password'
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: '-password'
        }
    });

    return res.json(200, {
        message: "Lists of posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){

            post.remove();    
            await Comment.deleteMany({post: req.params.id});
            return res.json(200, {
                message: "Post and associated comments deleted successfully"
            });

        }else{

            return res.json(401, {
                message: "You cannot delete this post"
            });

        }

    }catch(err){
        return res.json(500, {
            message: "Internal Server Error"
        });
    }

}

module.exports.create = async function(req, res){
    try{

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id  //  current signed in user is already stored in the locals
        });

        //  populate just the name and email of the user (we'll not want to send the password in the API)
        post = await post
        .populate('user', 'id name email')
        .execPopulate();
            
        return res.json(200, {
            success: true,
            message: "Post created!",
            data: {
                post: post
            }
        });

    }catch(err){
        return res.json(500, {
            success: false,
            message: "Internal Server Error"
        });
    }
};
