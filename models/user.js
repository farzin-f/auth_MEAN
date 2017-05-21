const MONGOOSE = require('mongoose');
const BCRYPT = require('bcryptjs');
const CONFIG = require('../config/database');

// User Schema
const USER_SCHEMA = MONGOOSE.Schema({
  name:{
    type: String
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});

const User = module.exports = MONGOOSE.model('User', USER_SCHEMA);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
  // console.log(newUser);
  // 10: number of rounds to generate the salt
  BCRYPT.genSalt(10, (err, salt) => {
    BCRYPT.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  BCRYPT.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}
