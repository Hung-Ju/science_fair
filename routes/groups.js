var express = require('express');
var router = express.Router();
var groups = require('../models/groups');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    //var notJoinGroupsArray = [];
    var member_id = req.session.member_id;
    groups.selectGroupsDataMemberNotJoin(member_id, function(result){
        if (result){
            // for (var i = 0; i < result.length; i++){
            //     //console.log(result[i].groups_id_groups);
            //     var groups_id_groups = result[i].groups_id_groups;
            //     groups.selectGroupsDataMemberNotJoin(groups_id_groups, function(result2){
            //         if(result2){
            //             result2 = JSON.stringify(result2);
			// 	        result2 = JSON.parse(result2);
            //             notJoinGroupsArray.push(result2);
            //             //console.log(result2);
            //             //console.log(notJoinGroupsArray);                 
            //         }
            //         console.log(notJoinGroupsArray);
            //     });
            // }

            console.log(result);
            res.render('groups', { title: '科展系統', member_id:req.session.member_id, member_name:req.session.member_name});
        }
        //console.log(notJoinGroupsArray); 
    }); 
     
    //res.render('groups', { title: '科展系統',notJoinGroups:notJoinGroupsArray, member_id:req.session.member_id, member_name:req.session.member_name});
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