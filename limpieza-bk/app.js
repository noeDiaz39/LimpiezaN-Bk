var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

// Using Node.js `require()`
const mongoose = require('mongoose');

// Using ES6 imports
//import mongoose from 'mongoose';
//conexion con mongodb
mongoose.connect('mongodb+srv://NoeDiaz:noe12998@cluster0-hhcle.mongodb.net/Limpieza_Nava', { useNewUrlParser: true, useUnifiedTopology: true });

//conexion con paginas
require('./models/empleado');
require('./models/trabajador')


var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var empleadoRouter = require('./routes/empleado');
const trabajadorRouter = require('./routes/trabajador');

var app = express();
app.use(cors({ origin: 'http://localhost:4200'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/empleado',empleadoRouter);
app.use('/trabajador', trabajadorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
