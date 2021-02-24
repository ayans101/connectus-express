const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const reset_password_controller = require('../controllers/reset_password_controller');

// console.log('router loaded');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signup);
router.get('/sign-in', usersController.signin);

router.post('/create', usersController.create);

//  use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
    'google', 
    {failureRedirect: '/users/sign-in'}
), usersController.createSession);


router.get('/forgot-password', reset_password_controller.forgotPassword);
router.post('/forgot-password-form', reset_password_controller.sendResetLink);

module.exports = router;