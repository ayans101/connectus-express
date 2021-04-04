const express = require('express');
const router = express.Router();
const usersApi = require('../../../controllers/api/v1/users_api');

router.post('/create-session', usersApi.createSession);
router.post('/register-user', usersApi.registerUser);
router.post('/update/:id', usersApi.update);
router.get('/:id', usersApi.profile);

module.exports = router;