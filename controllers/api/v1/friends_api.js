const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const Friendship = require("../../../models/friendship");
const env = require("../../../config/environment");

module.exports.addFriend = async function (req, res) {
    try{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        console.log("****", token);
        let fromUserId;
        await jwt.verify(token, env.jwt_secret, (err, user) => {
            console.log(err);
            if (err) {
                return res.json(403, {
                    message: "User not authenticated",
                    success: false,
                });
            }
            fromUserId = user._id;
        });
        let fromUser;
        await User.findById(fromUserId, (err, user) => {
            fromUser = user;
        });
        let toUser;
        await User.findById(req.params.userId, (err, user) => {
            toUser = user;
        });
        let ifFriendshipExists = await Friendship.findOne({
            from_user: fromUser._id,
            to_user: toUser._id
        })
        if(!ifFriendshipExists){
            let friendship = await Friendship.create({
                from_user: fromUser._id,
                to_user: toUser._id
            });
            fromUser.friendships.push(friendship);
            fromUser.save();
            return res.json(200, {
                message: `Now you're friends with ${toUser.name}`,
                success: true,
                data: {
                    friendship: {
                        to_user: {
                            _id: toUser._id,
                            email: toUser.email,
                            name: toUser.name
                        },
                        from_user: {
                            _id: fromUser._id,
                            email: fromUser.email,
                            name: fromUser.name
                        }
                    }
                }
            });
        }
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }


};
