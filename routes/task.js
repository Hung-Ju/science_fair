var express = require('express');
var router = express.Router();
var project = require('../models/project');
var task = require('../models/task');


router.get('/:gid',function(req, res, next) {
    var gid = req.params.gid;
    var member_id = req.session.member_id;
    var session_member_name = req.session.member_name;
    var groups_name;

    if(!member_id){
        res.redirect('/');
    }
    else {
        var groupsMemberArray = [];
        var groupsTaskArray = [];
        project.selectGroupsStage(gid)
        .then(function(groupsData){
            groups_name = groupsData[0].groups_name;
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
            return task.selectGroupsTaskData(gid)
            // res.render('task',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray});
        })
        .then(function(groupsTaskData){
            if(groupsTaskData){
                for(var j=0; j < groupsTaskData.length;j++){
                    var task_id = groupsTaskData[j].task_id;
                    var task_content = groupsTaskData[j].task_content;
                    var task_member_id = groupsTaskData[j].task_member_id;
                    var task_member_name = groupsTaskData[j].task_member_name;
                    var task_createtime = groupsTaskData[j].task_createtime;
                    var task_status = groupsTaskData[j].task_status;
                    allTaskData = {task_id:task_id, task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name, task_createtime:task_createtime, task_status:task_status};
                    groupsTaskArray.push(allTaskData);
                }
            }res.render('task',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:session_member_name, groups_name:groups_name, groupsMemberData:groupsMemberArray, groupsTaskData:groupsTaskArray});
        })
        
    }
});

router.post('/addTask', function(req, res, next) {
    var groups_id_groups = req.body.groups_id_groups;
    var task_content = req.body.task_content;
    var task_member_id = req.body.task_member_id;
    var task_member_name = req.body.task_member_name;
    var task_status = req.body.task_status;

    var member_id_member = req.session.member_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        task.addTask(groups_id_groups, task_content, task_member_id, task_member_name, task_status)
        .then(function(insert_params){
            return task.selectTaskChange(insert_params.insertId)
            // res.send({message:"true"});
        })
        .then(function(insertTask){
            var TaskArray = [];
            if(insertTask){
                for(var j=0; j < insertTask.length;j++){
                    var task_id = insertTask[j].task_id;
                    var task_content = insertTask[j].task_content;
                    var task_member_id = insertTask[j].task_member_id;
                    var task_member_name = insertTask[j].task_member_name;
                    var task_createtime = insertTask[j].task_createtime;
                    var task_status = insertTask[j].task_status;
                    allTaskData = {task_id:task_id, task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name, task_createtime:task_createtime, task_status:task_status};
                    TaskArray.push(allTaskData);
                }
            }
            res.send({message:"true", taskData:TaskArray});
        })
    }

})

router.post('/editTask', function(req, res, next) {
    var task_id = req.body.task_id;
    var task_content = req.body.task_content;
    var task_member_id = req.body.task_member_id;
    var task_member_name = req.body.task_member_name;
    var task_status = req.body.task_status;

    var member_id_member = req.session.member_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        task.editTask(task_id, task_content, task_member_id, task_member_name, task_status)
        .then(function(update_params){
            return task.selectTaskChange(task_id)
            // res.send({message:"true"});
        })
        .then(function(insertTask){
            var TaskArray = [];
            if(insertTask){
                for(var j=0; j < insertTask.length;j++){
                    var task_id = insertTask[j].task_id;
                    var task_content = insertTask[j].task_content;
                    var task_member_id = insertTask[j].task_member_id;
                    var task_member_name = insertTask[j].task_member_name;
                    var task_createtime = insertTask[j].task_createtime;
                    var task_status = insertTask[j].task_status;
                    allTaskData = {task_id:task_id, task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name, task_createtime:task_createtime, task_status:task_status};
                    TaskArray.push(allTaskData);
                }
            }
            res.send({message:"true", taskData:TaskArray});
        })
    }

})

router.post('/deleteTask', function(req, res, next) {
    var task_id = req.body.task_id
    var member_id_member = req.session.member_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        task.deleteTask(task_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }

})

router.post('/editTaskStatus', function(req, res, next) {
    var task_id = req.body.task_id;
    var task_status = req.body.task_status;

    var member_id_member = req.session.member_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        task.editTaskStatus(task_id, task_status)
        .then(function(update_params){
            return task.selectTaskChange(task_id)
            // res.send({message:"true"});
        })
        .then(function(insertTask){
            var TaskArray = [];
            if(insertTask){
                for(var j=0; j < insertTask.length;j++){
                    var task_id = insertTask[j].task_id;
                    var task_content = insertTask[j].task_content;
                    var task_member_id = insertTask[j].task_member_id;
                    var task_member_name = insertTask[j].task_member_name;
                    var task_createtime = insertTask[j].task_createtime;
                    var task_status = insertTask[j].task_status;
                    allTaskData = {task_id:task_id, task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name, task_createtime:task_createtime, task_status:task_status};
                    TaskArray.push(allTaskData);
                }
            }
            res.send({message:"true", taskData:TaskArray});
        })
    }

})

module.exports = router;