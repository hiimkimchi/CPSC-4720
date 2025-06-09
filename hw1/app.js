var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//tracksRouter is within albums.js
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var albumsRouter = require('./routes/albums');
var artistsRouter = require('./routes/artists');
var concertsRouter = require('./routes/concerts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/albums', albumsRouter);
app.use('/artists', artistsRouter);
app.use('/concerts', concertsRouter);

module.exports = app