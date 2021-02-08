module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: "Home"
    });
};

//  render the sign up page
module.exports.signup = function(req, res){
    return res.render('user_sign_up',{
        title: "ConnectUs | Sign Up"
    });
};

//  render the sign in page
module.exports.signin = function(req,res){
    return res.render('user_sign_in', {
        title: "ConnectUs | Sign In"
    });
};

//  get the sign up data
module.exports.create = function(req, res){
    //  TODO later
}

//  sign in and create a session for the user
module.exports.createSession = function(req, res){
    //  TODO later
}