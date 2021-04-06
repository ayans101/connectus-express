const express = require('express');
const router = express.Router();
const friendsApi = require('../../../controllers/api/v1/friends_api');

router.get('/fetch-user-friends', friendsApi.fetchUserFriends);
router.post('/create-friendship/:userId', friendsApi.addFriend);
router.post('/remove-friendship/:userId', friendsApi.removeFriend);

module.exports = router;