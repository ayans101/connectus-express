const express = require('express');
const router = express.Router();
const passport = require('passport');
const friendsApi = require('../../../controllers/api/v1/friends_api');

router.get('/fetch-user-friends', passport.authenticate('jwt', {session: false}), friendsApi.fetchUserFriends);
router.post('/create-friendship/:userId', passport.authenticate('jwt', {session: false}), friendsApi.addFriend);
router.post('/remove-friendship/:userId', passport.authenticate('jwt', {session: false}), friendsApi.removeFriend);

module.exports = router;