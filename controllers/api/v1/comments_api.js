const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post_id);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post_id,
                user: req.user._id  //  current signed in user is already stored in the locals
            });
            post.comments.push(comment);
            post.save();

            //  populate just the name and email of the user (we'll not want to send the password in the API)
            comment = await comment.populate('user', 'id name email').execPopulate();

            return res.json(200, {
                success: true,
                message: "Comment created!",
                data: {
                    comment: comment
                }
            });

        }

    }catch(err){
        return res.json(500, {
            success: false,
            message: "Internal Server Error"
        });
    }
};