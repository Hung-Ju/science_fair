var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var groupsRouter = require('./routes/groups');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session
var session = require('express-session');
app.use(session({
  secret: 'wenzi',
  cookie: { maxAge: 60*60*1000 },
  resave : false,
  saveUninitialized : true
}));

app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/groups', groupsRouter);

app.use(function(req, res, next){
    // 如果session中存在，則說明已經登入
      if( req.session.editor ){
          res.locals.editor = {
              editor_id : req.session.user.editor_id,
              editor_name : req.session.user.editor_name
          }
      }else{
          res.locals.editor = {};
      }
      next();
  });
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
      next(createError(404));
      next(err);
    });
    
    // error handlers
    
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

module.exports = app;
