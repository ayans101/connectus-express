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
            message: "Internal Server Error"
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

    if(req.body.id == req.params.id){
        try{
            await User.findById(req.body.id, function(err, usr){
                const authHeader = req.headers['authorization']
                const token = authHeader && authHeader.split(' ')[1];
                console.log("****", token);

                jwt.verify(token, env.jwt_secret, (_err, _usr) => {
                    if (!_usr || _err || _usr.email != usr.email) {
                        return res.json(401, {
                            message: "User not authorized",
                            success: false,
                        });
                    }else{
                        User.findByIdAndUpdate(req.body.id, req.body, function(err, user){
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
                })
            });
        }catch(err){
            console.log(err);
            return res.json(500, {
                message: "Internal Server Error"
            });
        }

    }else{
        return res.json(401, {
            message: "Unauthorized",
            success: false
        });
    }

}

module.exports.profile = async function(req, res){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    console.log("****", token);
    jwt.verify(token, env.jwt_secret, (err, user) => {
        console.log(err);
        if (err) {
            return res.json(403, {
                message: "User not authenticated",
                success: false,
            });
        }else{
            User.findById(req.params.id, function(err, user){
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
            });
        }
    
    })
};