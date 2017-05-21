const EXPRESS = require('express');
const MONGOOSE = require('mongoose');
const BODY_PARSER = require ('body-parser');
const CORS = require('cors');
const PASSPORT = require('passport');
const PATH = require('path');

// ---------- Connect to database ----------
const CONFIG = require('./config/database');
// MONGOOSE.Promise = global.Promise;
MONGOOSE.connect(CONFIG.database);

// Verify database connection
MONGOOSE.connection.on('connected', () => {
  console.log('Connected to ' + CONFIG.database);
});

// Database error detection
MONGOOSE.connection.on('error', (err) => {
  console.log('Database error ' + err);
});

// ---------- Server initialisation ----------
const SERVER = EXPRESS();
const PORT = 4000;

SERVER.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

SERVER.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
})

// CORS (Cross-origin resource sharing) middleware
SERVER.use(CORS());

// Body parser middleware
SERVER.use(BODY_PARSER.json());

// ---------- Passport middleware
SERVER.use(PASSPORT.initialize());
SERVER.use(PASSPORT.session());
// passing the passport to the passport.js
require('./config/passport')(PASSPORT);

// ---------- Users
const USERS = require('./routes/users');
SERVER.use('/users', USERS);

// ---------- Public static folder
SERVER.use(EXPRESS.static(PATH.join(__dirname, 'public')));
