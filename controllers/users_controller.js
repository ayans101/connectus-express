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