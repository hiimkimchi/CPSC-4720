//NOTE:
//hw2 will run on port 3001. this is designed in order to retrieve data from hw1,
//which should run on port 3000. 

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { auth, requiresAuth } = require('express-openid-connect');

//Generate auth0 secret (stored in .env)
// let secret = require('crypto').randomBytes(32).toString('hex');
// console.log(secret)

require('dotenv').config()

var playlistsRouter = require('./routes/playlists');
var tracksRouter = require('./routes/tracks');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: 'http://localhost:3001',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: 'http://dev-12wc7aov2l1pf7o8.us.auth0.com'
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(auth(config));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/playlists', playlistsRouter);
app.use('/tracks', tracksRouter);

module.exports = app;