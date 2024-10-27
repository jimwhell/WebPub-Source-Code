var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var pageRoutes = require('./routes/pageRoutes')
var productRoutes = require('./routes/productsRoutes')
var customRoutes = require('./routes/pageRoutes')
var contactRoutes = require('./routes/pageRoutes')

var adminRoutes = require('./routes/adminRoutes');
var userRoutes = require('./routes/userRoutes');


//var tryRoutes = require('./routes/productsRoutes')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
  }));


//routings
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', pageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/custom', customRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
//app.use('/api/try', tryRoutes);




// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
