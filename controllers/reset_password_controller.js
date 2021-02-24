const User = require('../models/user');
const ResetPasswordToken = require('../models/reset_password_token');
const crypto = require('crypto');
const nodeMailer = require('../config/nodemailer');
const { url } = require('inspector');

module.exports.forgotPassword = function(req,res){

    return res.render('user_forgot_password', {
        title: "ConnectUs | Forgot Password"
    });
};

module.exports.sendResetLink = async function(req, res){
    try{

        await User.findOne({email: req.body.email}, function(err, user){
            if(!user){
                req.flash('error', 'User not signed up with this email');
                return res.redirect('/users/sign-up');
            }
            ResetPasswordToken.create({
                user: user,
                accessToken: crypto.randomBytes(20).toString('hex'),
                isValid: true
            }, function(err, reset_password_token){
                nodeMailer.transporter.sendMail({
                    from: 'cindy.tromp@ethereal.email',
                    to: user.email,
                    subject: "Reset Password",
                    html: `
                        <p>You requested for password reset</p>
                        <h5>
                        click this 
                        <a href="http://localhost:8080/users/change_password/${reset_password_token.accessToken}">link</a>
                        to reset password
                        </h5>
                    `
                }, (err, info) => {
                    if(err){
                        console.log('Error in sending mail', err);
                        return;
                    }
            
                    console.log('Message sent', info);
                    req.flash('success', 'Check email to reset password');
                    return res.redirect('/users/sign-in');
                });
            });
    
        });


    }catch{
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.getNewPassword = function(req,res){
    res.locals.token = req.url.split('/')[2];

    return res.render('user_change_password', {
        title: "ConnectUs | New Password"
    });
}

module.exports.resetPassword = function(req, res){
    if(req.body.new_password != req.body.confirm_password){
        req.flash('error', `New Password and Confirm Password don't match`);
        return res.redirect('back');
    }else{
        let accessToken = req.url.split('/')[2];
        ResetPasswordToken.findOne({accessToken: accessToken}, function(err, resetPasswordToken){
            if(resetPasswordToken.isValid){
                let user_id = resetPasswordToken.user;
                User.findById(user_id, function(err, user){
                    user.password = req.body.new_password;
                    user.save();
                    resetPasswordToken.isValid = false;
                    resetPasswordToken.save();
                    req.flash('success', 'Password reset successfully');
                    return res.redirect('/users/sign-in');
                });
            }else{
                req.flash('error', 'Token expired! Make a new request');
                return res.redirect('/users/forgot-password');
            }
        });
    }
}