const express = require('express');
const router = express.Router();
const friendsApi = require('../../../controllers/api/v1/friends_api');

router.post('/create-friendship/:userId', friendsApi.addFriend);

module.exports = router;