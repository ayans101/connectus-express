const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersApi = require('../../../controllers/api/v1/users_api');

router.post('/create-session', usersApi.createSession);
router.post('/register-user', usersApi.registerUser);
router.post('/update/:id', passport.authenticate('jwt', {session: false}), usersApi.update);
router.get('/:id', passport.authenticate('jwt', {session: false}), usersApi.profile);
router.post('/search', passport.authenticate('jwt', {session: false}), usersApi.searchUsers);

module.exports = router;