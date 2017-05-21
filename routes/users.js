const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const PASSPORT = require('passport');
const JWT = require('jsonwebtoken');
const CONFIG = require('../config/database');

const User = require('../models/user');

// Register a user
ROUTER.post('/register', (req, res, next) => {
  // res.send('REGISTER');
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  // console.log(newUser);

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, message: 'Failed to register user'});
    } else {
      res.json({success: true, message: 'User registered'});
    }
  });
});

// Autenticate a user
ROUTER.post('/authenticate', (req, res, next) => {
  // res.send('AUTHENTICATE');
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) res.json({success: false, message: 'User not found'});

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;

      if(isMatch){
        // the token is used to give the authorization to a specific user
          const token = JWT.sign(user, CONFIG.secret, {
            expiresIn: 604800 // 1 week
          });

          res.json({
            success: true,
            token: 'JWT ' + token,
            // resending the user fields without his password
            user: {
              id: user._id,
              name: user.name,
              usernmae: user.username,
              email: user.email
            }
          });
      } else {
        res.json({
          success: false,
          message: 'Wrong password'
        });
      }
    });

  });
});

// User profile
// ROUTER.get('/profile', (req, res, next) => {
//   res.send('PROFILE');
ROUTER.get('/profile', PASSPORT.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = ROUTER;
