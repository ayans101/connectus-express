const express = require('express');
const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/friendship', require('./friends'));

module.exports = router;