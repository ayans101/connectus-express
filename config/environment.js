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
    jwt_secret: 'connectUs'
}

const production = {
    name: 'production'
}

module.exports = development;