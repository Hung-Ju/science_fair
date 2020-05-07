var express = require('express');
var router = express.Router();
var groups = require('../models/groups');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    var member_id = req.session.member_id;
    if(!member_id){
        res.redirect('/');
    }
    // groups.selectAllGroupsData(member_id, function(result){
    //     if (result){
    //         //console.log(result);
    //         //抓取所有已登入使用者id已經加入的組別資料
    //         groups.selectGroupsDataMemberJoin(member_id, function(result2){
    //             console.log(result2);
    //             res.render('groups', { title: 'Science Fair科學探究專題系統', notJoinGroups:result, JoinGroups:result2,member_id:req.session.member_id, member_name:req.session.member_name});
    //         })
            
    //     } 
    // }); 

    var allGroupsArray = [];
    var memberJoinGroupsArray = [];
    groups.selectAllGroupsData(member_id, function(allGroups){
        if (allGroups){
            for (var i = 0; i < allGroups.length; i++){
                var day = new Date(allGroups[i].groups_createtime);
                var groups_index = i;
                var groups_id = allGroups[i].groups_id;
                var groups_name = allGroups[i].groups_name;
                var groups_key = allGroups[i].groups_key;
                var groups_introduction = allGroups[i].groups_introduction;
                var member_id_student_member = allGroups[i].member_id_student_member;
                var groups_create_student = allGroups[i].groups_create_student;
                var member_id_teacher_member = allGroups[i].member_id_teacher_member;
                var groups_teacher = allGroups[i].groups_teacher;
                var groups_createtime_month = day.getMonth()+1;
                var groups_createtime = day.getFullYear()+'/'+groups_createtime_month+'/'+day.getDate();
                var groups_stage = allGroups[i].groups_stage;
                var allGroupsData = {groups_index:groups_index, groups_id:groups_id, groups_name:groups_name, groups_key:groups_key, groups_introduction:groups_introduction, member_id_student_member:member_id_student_member, 
                                    groups_create_student:groups_create_student, member_id_teacher_member:member_id_teacher_member, groups_teacher:groups_teacher, 
                                    groups_createtime:groups_createtime, groups_stage:groups_stage};
                allGroupsArray.push(allGroupsData);
                //console.log(allGroupsArray);
            }

            groups.selectGroupsDataMemberJoin(member_id, function(memberJoinGroups){
                for (var j = 0; j < memberJoinGroups.length; j++){
                    var day = new Date(memberJoinGroups[j].groups_createtime);
                    var groups_id = memberJoinGroups[j].groups_id;
                    var groups_name = memberJoinGroups[j].groups_name;
                    var groups_introduction = memberJoinGroups[j].groups_introduction;
                    var groups_createtime_month = day.getMonth()+1;
                    var groups_createtime = day.getFullYear()+'/'+groups_createtime_month+'/'+day.getDate();
                    var groups_member_id = memberJoinGroups[j].groups_member_id;
                    var member_name = memberJoinGroups[j].member_name;
                    var memberJoinGroupsData = {groups_id:groups_id, groups_name:groups_name,groups_introduction:groups_introduction, groups_createtime:groups_createtime, groups_member_id:groups_member_id,
                                                member_name:member_name};
                    memberJoinGroupsArray.push(memberJoinGroupsData);
                }
                //console.log(memberJoinGroupsArray);
                res.render('groups', { title: 'Science Fair科學探究專題系統', notJoinGroups:allGroupsArray, JoinGroups:memberJoinGroupsArray,member_id:req.session.member_id, member_name:req.session.member_name});

            })
        }
    })

});

//進入新增組別頁面
router.get('/add',function(req, res, next) {
    res.render('groupsFile', { title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name});
});

//新增組別
router.post('/add',function(req, res, next) {
    var groups_name = req.body.groups_name || '',
        groups_key = req.body.groups_key || '',
        groups_introduction = req.body.groups_introduction,
        member_id_student_member = req.session.member_id,
        groups_create_student = req.session.member_name;

    if(!member_id_student_member){
        res.send({message:"false"});
    }else if(groups_name=="" || groups_key==""){
        res.send({message:"nullContent"});
    }else{
        groups.addGroups(groups_name, groups_key, groups_introduction, member_id_student_member, groups_create_student, function(result){
            if(result){
                //console.log(result.insertId);
                var groups_id_groups = result.insertId;
                groups.addGroupsMember(groups_id_groups, member_id_student_member, groups_create_student, function(result2){
                    if(result){
                        res.send({message:"true"});
                    }
                })
            }
        });
    }

    
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