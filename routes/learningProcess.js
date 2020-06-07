var express = require('express');
var router = express.Router();
var project = require('../models/project');
var task = require('../models/task');
var learningProcess = require('../models/learningProcess');


router.get('/:gid',function(req, res, next) {
    var gid = req.params.gid;
    var member_id = req.session.member_id;
    var session_member_name = req.session.member_name;
    var groups_name;
    var groups_introduction;
    var ideaActionData;
    var ideaScaffoldData;
    var ideaIncreaseData;
    var socialNetworkData;

    if(!member_id){
        res.redirect('/');
    }
    else {
        var groupsMemberArray = [];
        project.selectGroupsStage(gid)
        .then(function(groupsData){
            groups_name = groupsData[0].groups_name;
            groups_introduction = groupsData[0].groups_introduction;
            return task.selectGroupsMemberData(gid)
        })
        .then(function(groupsMemberData){
            if(groupsMemberData){
               for(var i = 0; i < groupsMemberData.length; i++){
                    var member_id_member = groupsMemberData[i].member_id_member;
                    var member_name = groupsMemberData[i].member_name;
                    allGroupsMemberData = {member_id_member:member_id_member, member_name:member_name};
                    groupsMemberArray.push(allGroupsMemberData);
                } 
            }
            return learningProcess.getGroupIdeaAction(gid)
            // res.render('learningProcess',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, groups_introduction:groups_introduction});
        })
        .then(function(ActionData){
            ideaActionData = ActionData;
            return learningProcess.getScaffoldData(gid)
            // res.render('learningProcess',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, ideaActionData:ideaActionData});
        })
        .then(function(scaffoldData){
            ideaScaffoldData = scaffoldData;
            return learningProcess.getGroupIdeaIncrease(gid)
            //res.render('learningProcess',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, ideaActionData:ideaActionData, ideaScaffoldData:ideaScaffoldData});
        })
        .then(function(IncreaseData){
            ideaIncreaseData = IncreaseData;
            return learningProcess.getGroupsSocialNetworkData(gid)
            // res.render('learningProcess',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, ideaActionData:ideaActionData, ideaScaffoldData:ideaScaffoldData,ideaIncreaseData:ideaIncreaseData});
        })
        .then(function(socialData){
            socialNetworkData = socialData;
            res.render('learningProcess',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, ideaActionData:ideaActionData, ideaScaffoldData:ideaScaffoldData,ideaIncreaseData:ideaIncreaseData,socialNetworkData:socialNetworkData});
        })
        
    }
});

module.exports = router;