const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const env = require('../../../config/environment')

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid username or password",
                success: false
            });
        }

        return res.json(200, {
            message: "Sign in successful, here is your token, please keep it safe",
            success: true,
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1d'}),
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id
                }
            }
        });

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error",
            success: false
        });
    }
}

module.exports.registerUser = function(req, res){

    if(req.body.password != req.body.confirm_password){
        return res.json(400, {
            message: "The passwords entered do not match",
            success: false
        });
    }else{
        User.findOne({email: req.body.email}, function(err, user){
            if(!user){
                User.create(req.body, function(err, user){
                    return res.json(200, {
                        message: "Sign up successful, here is your token, please keep it safe",
                        success: true,
                        data: {
                            token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1d'}),
                            user: {
                                name: user.name,
                                email: user.email,
                                _id: user._id
                            }
                        }
                    });
                });
            }else{
                return res.json(422, {
                    message: "There already exists an account registered with this email address",
                    success: false
                });
            }
        });   
    }
}

module.exports.update = async function(req, res){

    try{
        if(req.body.id == req.params.id && req.body.id == req.user._id){
            await User.findByIdAndUpdate(req.body.id, req.body, function(err, user){
                user.name = req.body.name;
                if(req.body.password){
                    user.password = req.body.password;
                }
                user.save();
                return res.json(200, {
                    message: "User updated successfully",
                    success: true,
                    data: {
                        token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1d'}),
                        user: {
                            name: user.name,
                            email: user.email,
                            _id: user._id
                        }
                    }
                });
            }) 
        }
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error",
            success: false
        });
    }

}

module.exports.profile = async function(req, res){
    try{
        await User.findById(req.params.id, function(err, user){
            if(!user){
                return res.json(404, {
                    message: "User not found",
                    success: false,
                })
            }else{
                return res.json(200, {
                    message: "User Details",
                    success: true,
                    data: {
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                        }
                    }
                });
            }
        });
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error",
            success: false
        });
    }
};

module.exports.searchUsers = async function(req, res){
    try{
        // console.log(req.query);
        // { text: 'abc' }
        
        await User.find({ name: { $regex : new RegExp(req.query.text, "i") } }, (err, users) => {
            const list = users.map((user) => {
                const usr = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
                return usr;
            });
            
            return res.json(200, {
                message: "Request successful!",
                success: true,
                data: {
                    users: list
                }
            });
            
        });

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error",
            success: false
        });

    }
}