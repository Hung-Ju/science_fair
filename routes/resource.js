var express = require('express');
var router = express.Router();
var project = require('../models/project');
var resource = require('../models/resource');

router.get('/:gid',function(req, res, next) {
    var gid = req.params.gid;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    var groups_name;
    var allGroupsFileArray = [];
    if(!member_id){
        res.redirect('/');
    }
    else {
        project.selectGroupsStage(gid)
        .then(function(groupsData){
            groups_name = groupsData[0].groups_name;
            return resource.selectGroupsFile(gid)
            
        })
        .then(function(groupsFileData){
            if(groupsFileData){
                for (var i = 0; i < groupsFileData.length; i++){
                    var file_id = groupsFileData[i].file_id;
                    var node_id_node = groupsFileData[i].node_id_node;
                    var file_name = groupsFileData[i].file_name;
                    var file_type = groupsFileData[i].file_type;
                    var file_upload_time = groupsFileData[i].file_upload_time;
                    var member_name = groupsFileData[i].member_name;
                    allGroupsFileData = {file_id:file_id, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_upload_time:file_upload_time, member_name:member_name}
                    allGroupsFileArray.push(allGroupsFileData);
                }
            }
            console.log(allGroupsFileArray);
            
            res.render('resource',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:member_name, groups_name:groups_name, allGroupsFileData:allGroupsFileArray});
        })
        
    }
});

module.exports = router;