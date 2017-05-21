const JWT_STRATEGY = require('passport-jwt').Strategy;
const EXTRACT_JWT = require('passport-jwt').ExtractJwt;
const USER = require('../models/user');
const CONFIG = require('../config/database');

module.exports = function(passport){
let opts = {};
//fromAuthHeader: to pass the token back & forth from authorization header
opts.jwtFromRequest = EXTRACT_JWT.fromAuthHeader();
opts.secretOrKey = CONFIG.secret;
passport.use(new JWT_STRATEGY(opts, (jwt_payload, done) => {
  // console.log(jwt_payload); to see where _id is exactly stored in jwt_payload
    USER.getUserById(jwt_payload._doc._id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));
}
