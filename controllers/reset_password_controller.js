const User = require('../models/user');
const ResetPasswordToken = require('../models/reset_password_token');
const crypto = require('crypto');
const nodeMailer = require('../config/nodemailer');

module.exports.forgotPassword = function(req,res){

    return res.render('user_forgot_password', {
        title: "ConnectUs | Reset Password"
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