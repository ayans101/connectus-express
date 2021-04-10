const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
const Like = require('../../../models/like');

module.exports.toggleLike = async function(req, res){
    try{
        // console.log(req.query);
        // { likeable_id: '606ebca76bb7fe6ea7e9585a', likeable_type: 'Post' }

        let likeable;
        let deleted = false;

        if(req.query.likeable_type == 'Post'){
            likeable = await Post.findById(req.query.likeable_id);
        }else{
            likeable = await Comment.findById(req.query.likeable_id);
        }

        //  check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.likeable_id,
            onModel: req.query.likeable_type,
            user: req.user._id
        });

        //  if a like already exists then delete it
        if(existingLike){
            likeable.likes.pull(req.user._id);
            likeable.save();

            existingLike.remove();
            deleted = true;

        }else{
            //  else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.likeable_id,
                onModel: req.query.likeable_type
            });

            likeable.likes.push(req.user._id);
            likeable.save();
        }

        return res.json(200, {
            success: true,
            message: "Request Successful!",
            data: {
                deleted: deleted
            }
        })


    }catch(err){
        return res.json(500, {
            success: false,
            message: "Internal Server Error"
        });
    }
};