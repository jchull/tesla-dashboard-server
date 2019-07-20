var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

var server = express();

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(cors({
  origin: 'http://localhost:3000' // TODO: get from configuration
}));

server.use('/', indexRouter);
server.use('/users', usersRouter);
server.use('/products', productsRouter);

module.exports = server;
