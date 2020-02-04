var express = require('express');
var router = express.Router();
var groups = require('../models/groups');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    var member_id = req.session.member_id;
    //抓取所有已登入使用者id未加入的組別資料
    groups.selectGroupsDataMemberNotJoin(member_id, function(result){
        if (result){
            console.log(result);
            //抓取所有已登入使用者id已經加入的組別資料
            groups.selectGroupsDataMemberJoin(member_id, function(result2){
                res.render('groups', { title: '科展系統', notJoinGroups:result, JoinGroups:result2,member_id:req.session.member_id, member_name:req.session.member_name});
            })
            
        } 
    }); 

});

//進入新增組別頁面
router.get('/add',function(req, res, next) {
    res.render('groupsFile', { title: '科展系統', member_id:req.session.member_id, member_name:req.session.member_name});
});

//新增組別
router.post('/add',function(req, res, next) {
    var groups_name = req.body.groups_name || '',
        groups_key = req.body.groups_key || '',
        member_id_student_member = req.session.member_id,
        groups_create_student = req.session.member_name;

    groups.addGroups(groups_name, groups_key, member_id_student_member, groups_create_student, function(result){
        if(result){
            console.log(result.insertId);
            var groups_id_groups = result.insertId;
            groups.addGroupsMember(groups_id_groups, member_id_student_member, groups_create_student, function(result2){
                if(result){
                    res.send({message:"true"});

                }
            })
        }
    });
});

module.exports = router;