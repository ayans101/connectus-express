const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'id name email').execPopulate();
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in sending to the queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            });


            if(req.xhr){

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'Comment created!'
                });
            }

            req.flash('success', 'Comment published!');
    
            res.redirect('/');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{

        let comment = await Comment.findById(req.params.id);
        let post = await Post.findById(comment.post);
        if(comment.user == req.user.id || post.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            
            //  delete the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Post deleted'
                });
            }

            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }

    }catch{
        req.flash('error', err);
        return res.redirect('back');
    }
}