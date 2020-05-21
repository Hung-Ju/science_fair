var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var groupsRouter = require('./routes/groups');
var projectRouter = require('./routes/project');
var projectDiscussion = require('./models/projectDiscussion');


var app = express();
var server = require('http').Server(app);
server.listen(8000, function(){
    console.log("server listening on port 8000");
})
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    //發送訊息經過 news通道 傳送object
    //emit是傳送
    socket.emit('news', { hello: 'world' });
    //on是接收
    socket.on('my other event', (data) => {
        console.log(data);
    });
    socket.on('disconnect',function () {
      console.log("<disconnect>");
    });

    //加入房間
    socket.on("join groups", function(data){
        console.log("進入小組"+data);
        var roomName = 'groups_'+ data;
        socket.join(roomName);
        socket.nsp.to(roomName).emit('join room：',roomName);
    })

    socket.on("add node", function(data){
        //console.log(data);
        var roomName = 'groups_'+ data.gid;
        if (data.nodeData.length > 0){
            console.log("新增的NodeData"+data.nodeData);
            var nodeData = data.nodeData
            socket.nsp.to(roomName).emit('update node data', nodeData);
        }
    })

    socket.on("add edge", function(data){
        console.log(data.edgeData);
        var roomName = 'groups_'+ data.gid;
        if (data.edgeData.length > 0){
            console.log("新增的edgeData"+data.edgeData);
            var edgeData = data.edgeData
            socket.nsp.to(roomName).emit('update edge data', edgeData);
        }
    })

    socket.on('update node position', function(data){
        var roomName = 'groups_'+ data.gid;
        var updateNodeDataString = data.updateNodeData;
        // var updateNodeData = JSON.stringify(updateNodeDataString);
        // var node_id = data.updateNodeData.node_id;
        // var node_x = data.updateNodeData.x;
        // var node_y = data.updateNodeData.y;
        // console.log(updateNodeData);
        projectDiscussion.updateNodePosition(updateNodeDataString)
        .then(function(results){
            console.log('update by '+ data.gid);
            console.log(results);
        })
        socket.nsp.to(roomName).emit('update node position',data.updateNodeData);
    });


});


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
app.use('/project', projectRouter);

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
