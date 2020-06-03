var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var groupsRouter = require('./routes/groups');
var projectRouter = require('./routes/project');
var resourceRouter = require('./routes/resource');
var convergenceRouter = require('./routes/convergence');

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

    //接收到新增的節點資料後，把資料送回指定的房間
    socket.on("add node", function(data){
        //console.log(data);
        var roomName = 'groups_'+ data.gid;
        if (data.nodeData.length > 0){
            console.log("新增的NodeData"+data.nodeData);
            var nodeData = data.nodeData
            socket.nsp.to(roomName).emit('update node data', nodeData);
        }
    })

    //接收到新增的edge資料後，把資料送回指定的房間
    socket.on("add edge", function(data){
        console.log(data.edgeData);
        var roomName = 'groups_'+ data.gid;
        if (data.edgeData.length > 0){
            console.log("新增的edgeData"+data.edgeData);
            var edgeData = data.edgeData
            socket.nsp.to(roomName).emit('update edge data', edgeData);
        }
    })

    //接收到結點位置移動後的資料，把資料庫中的資料更新
    socket.on('update node position', function(data){
        var roomName = 'groups_'+ data.gid;
        var updateNodeDataString = data.updateNodeData;
        projectDiscussion.updateNodePosition(updateNodeDataString)
        .then(function(results){
            console.log('update by '+ data.gid);
            console.log(results);
        })
        socket.nsp.to(roomName).emit('update node position',data.updateNodeData);
    });

    //接收到新增的參考文獻節點資料後，把資料送回指定的房間
    socket.on("add reference node", function(data){
        //console.log(data);
        var roomName = 'groups_'+ data.gid;
        if (data.nodeData.length > 0){
            console.log("新增的ReferenceNodeData"+data.nodeData);
            var nodeData = data.nodeData
            socket.nsp.to(roomName).emit('update reference node data', nodeData);
        }
    })

    //接收到新增的參考文獻edge資料後，把資料送回指定的房間
    socket.on("add reference edge", function(data){
        //console.log(data.edgeData);
        var roomName = 'groups_'+ data.gid;
        if (data.edgeData.length > 0){
            console.log("新增的edgeData"+data.edgeData);
            var edgeData = data.edgeData
            socket.nsp.to(roomName).emit('update reference edge data', edgeData);
        }
    })

    //接收到修改的節點資料後，把資料送回指定的房間
    socket.on("edit idea", function(data){
        //console.log(data);
        var roomName = 'groups_'+ data.gid;
        if (data.nodeData.length > 0){
            console.log("更新的NodeData"+data.nodeData);
            var nodeData = data.nodeData
            socket.nsp.to(roomName).emit('update node data', nodeData);
        }
    })

    //接收到修改的參考文獻資料後，把資料送回指定的房間
    socket.on("edit reference", function(data){
        var roomName = 'groups_'+ data.gid;
        if (data.nodeData.length > 0){
            console.log("更新的NodeData"+data.nodeData);
            var nodeData = data.nodeData
            socket.nsp.to(roomName).emit('update node data', nodeData);
        }
    })

    //接收到summernote修改後的資料，把資料庫中的資料更新
    socket.on('update summernote content', function(data){
        var roomName = 'groups_'+ data.gid;
        var updateSummernoteData = data.updateSummernoteData;
        console.log(updateSummernoteData);
        // projectDiscussion.updateNodePosition(updateNodeDataString)
        // .then(function(results){
        //     console.log('update by '+ data.gid);
        //     console.log(results);
        // })
        socket.nsp.to(roomName).emit('update summernote content',updateSummernoteData);
    });

    //接收到新增的節點資料後，把資料送回指定的房間
    socket.on("add message", function(data){
        //console.log(data);
        var roomName = 'groups_'+ data.gid;
        if (data.newInsertMessage.length > 0){
            console.log("新增的messageData"+data.newInsertMessage[0]);
            var newInsertMessage = data.newInsertMessage[0];
            socket.nsp.to(roomName).emit('update message data', {newInsertMessage:newInsertMessage, message_tag:data.message_tag});
        }
    })


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
  cookie: { maxAge: 60*60*2000 }, //2小時
  resave : false,
  saveUninitialized : true
}));

app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/groups', groupsRouter);
app.use('/project', projectRouter);
app.use('/resource', resourceRouter);
app.use('/convergence', convergenceRouter);

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
