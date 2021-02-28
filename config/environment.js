const fs =require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

const development = {
    name: 'development',
    assets_path: './assets',
    session_cookie_key: 'something',
    db: 'connectUs_development',
    smtp: {
        // service: 'gmail',
        // host: 'smtp.gmail.com'
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'cindy.tromp@ethereal.email',
            pass: 'Dh9QV1z4bSdnsQw7r2'
        }
    },
    google_client_id: "543150578036-fatomr3nqkmv34ng7u23e6s0usolevhs.apps.googleusercontent.com",
    google_client_secret: "2zA3-2rVoyzn3yv-h7aRTtUZ",
    google_call_back_url: "http://localhost:8080/users/auth/google/callback",
    jwt_secret: 'connectUs',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    assets_path: process.env.CONNECTUS_ASSET_PATH,
    session_cookie_key: process.env.CONNECTUS_SESSION_COOKIE_KEY,
    db: process.env.CONNECTUS_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CONNECTUS_GMAIL_USERNAME,
             pass: process.env. CONNECTUS_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CONNECTUS_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CONNECTUS_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CONNECTUS_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CONNECTUS_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CONNECTUS_ENVIRONMENT) == undefined ? development : eval(process.env.CONNECTUS_ENVIRONMENT);