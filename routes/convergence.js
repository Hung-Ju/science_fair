var express = require('express');
var router = express.Router();
var project = require('../models/project');
var resource = require('../models/resource');
var fs = require("fs");
var multer = require("multer");

router.get('/:gid',function(req, res, next) {
    var gid = req.params.gid;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    var groups_name;

    if(!member_id){
        res.redirect('/');
    }
    else {
        project.selectGroupsStage(gid)
        .then(function(groupsData){
            groups_name = groupsData[0].groups_name;
            console.log(groups_name);
        })
        res.render('convergence',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:member_name, groups_name:groups_name});
    }
});

module.exports = router;