const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter;
let renderTemplate;

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
    if(err){
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }

    console.log('Credentials obtained, sending message...');

    transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass, // generated ethereal password
        }
    });

    renderTemplate = (data, relativePath) => {
        let mailHTML;
        ejs.renderFile(
            path.join(__dirname, '../views/mailers', relativePath),
            data,
            function(err, template){
                if(err){ console.log('error in rendering template'); return;}

                mailHTML = template;
            }
        )
        return mailHTML;
    }

});

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}