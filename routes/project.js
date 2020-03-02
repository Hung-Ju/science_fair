var express = require('express');
var router = express.Router();
var project = require('../models/project');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    var gid = req.query.gid;
    var member_id = req.session.member_id;

    if(!member_id){
        res.redirect('/');
    }
    //要記得寫登入的人是否有進入該gid的權限判斷!!!
    console.log(gid);
	res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name});

});

module.exports = router;