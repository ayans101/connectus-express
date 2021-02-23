const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')


let transporter = nodemailer.createTransport({
    // service: 'gmail',
    // host: 'smtp.gmail.com'
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'cindy.tromp@ethereal.email',
        pass: 'Dh9QV1z4bSdnsQw7r2'
    }
});


let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
         if (err){console.log('error in rendering template'); return}
         
         mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
