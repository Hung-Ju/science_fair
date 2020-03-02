var express = require('express');
var router = express.Router();
var groups = require('../models/groups');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    var member_id = req.session.member_id;
    if(!member_id){
        res.redirect('/');
    }
    groups.selectAllGroupsData(member_id, function(result){
        if (result){
            console.log(result);
            //抓取所有已登入使用者id已經加入的組別資料
            groups.selectGroupsDataMemberJoin(member_id, function(result2){
                res.render('groups', { title: 'Science Fair科學探究專題系統', notJoinGroups:result, JoinGroups:result2,member_id:req.session.member_id, member_name:req.session.member_name});
            })
            
        } 
    }); 

});

//進入新增組別頁面
router.get('/add',function(req, res, next) {
    res.render('groupsFile', { title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name});
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

//未加入組別的成員輸入密碼申請加入組別
router.post('/joinGroups',function(req, res, next) {
    var groups_id = req.body.groups_id || '',
        groups_key = req.body.groups_key || '';

    groups.checkGroupsPassword(groups_id, groups_key, function(result){
        if(result.length){
            var member_id = req.session.member_id;
            groups.checkGroupsAlready(groups_id, member_id, function(result2){
                if(result2.length != 0){
                    console.log(result2.length);
                    res.send({message:"already"});
                }
                else{
                    var groups_id_groups = result[0].groups_id,
                    member_id_member = req.session.member_id,
                    member_name = req.session.member_name;
                    groups.addGroupsMember(groups_id_groups, member_id_member, member_name, function(result3){
                        if(result3){
                            res.send({message:"true"});
                        }
                    })
                }
            })    
        }
        else{
            res.send({message:"false"});
        }
    });
});

module.exports = router;