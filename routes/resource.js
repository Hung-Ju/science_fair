var express = require('express');
var router = express.Router();
var project = require('../models/project');
var resource = require('../models/resource');
var fs = require("fs");
var multer = require("multer");

//定義檔案上傳的臨時資料夾
var upload = multer({
    dest: './public/temp_uploads'
});

router.get('/:gid',function(req, res, next) {
    var gid = req.params.gid;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    var groups_name;
    var allGroupsFileArray = [];
    var allPersonalFileArray = [];
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
                    var groups_id_groups = groupsFileData[i].groups_id_groups;
                    var node_type = groupsFileData[i].node_type;
                    var file_share = groupsFileData[i].file_share;
                    allGroupsFileData = {file_id:file_id, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_upload_time:file_upload_time, member_name:member_name, groups_id_groups:groups_id_groups, node_type:node_type,file_share:file_share}
                    allGroupsFileArray.push(allGroupsFileData);
                }
            }
            return resource.selectPersonalFile(gid, member_id)
        })
        .then(function(personalFileData){
            if(personalFileData){
                for (var j = 0; j < personalFileData.length; j++){
                    var file_id = personalFileData[j].file_id;
                    var node_id_node = personalFileData[j].node_id_node;
                    var file_name = personalFileData[j].file_name;
                    var file_type = personalFileData[j].file_type;
                    var file_upload_time = personalFileData[j].file_upload_time;
                    var member_name = personalFileData[j].member_name;
                    var file_share = personalFileData[j].file_share;
                    allPersonalFileData = {file_id:file_id, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_upload_time:file_upload_time, member_name:member_name, file_share:file_share}
                    allPersonalFileArray.push(allPersonalFileData);
                }
            }

            res.render('resource',{ title: 'Science Fair科學探究專題系統',gid:gid, member_id:member_id, member_name:member_name, groups_name:groups_name, allGroupsFileData:allGroupsFileArray, allPersonalFileData:allPersonalFileArray});
        })
        
    }
});

//上傳小組或個人檔案
router.post('/addFile', upload.array('files', 5), function(req, res, next){
    var groups_id_groups = req.body.groups_id_groups;
    var file_share = req.body.file_share;
    var node_id_node = req.body.node_id_node;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var fileslength = req.files.length;
    var fileData = req.files;

    if(!member_id_member){
        res.send({message: "false"});
    }else{
        if(file_share == 0){
            resource.existsFileCheck(groups_id_groups, fileData)
            .then(function(result){
                if (result == 0 || result.length == 0){
                    var fileDataArray = [];
                    
                    for (var i = 0; i < fileslength; i++){
                        var originalname = req.files[i].originalname;
                        var file_type_origin = req.files[i].mimetype;
                        var file_type;
                        if(file_type_origin == "image/jpeg" || file_type_origin == "image/png" || file_type_origin == "image/gif"){
                            file_type = "圖片";
                        }else{
                            file_type = "文件";
                        }

                        fs.rename(req.files[i].path, "./public/upload_file/group"+groups_id_groups+"/groups_file/"+originalname , function(err) {
                            if (err) {
                                throw err;
                            } 
                        })

                        fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:originalname, file_type:file_type, file_share:file_share, member_id_member:member_id_member, member_name:member_name});

                    }
                    return resource.addFile(fileDataArray)
                    .then(function(insertFile){
                        
                        res.send({message:"true" , fileDataArray:insertFile})
                    })
                    
                }else{
                    res.send({message:"same", sameFile:result})
                }
            })
        }else{
            resource.existsFileCheckPersonal(groups_id_groups, member_id_member, fileData)
            .then(function(result){
                if (result == 0 || result.length == 0){
                    var fileDataArray = [];
                    
                    for (var i = 0; i < fileslength; i++){
                        var originalname = req.files[i].originalname;
                        var file_type_origin = req.files[i].mimetype;
                        var file_type;
                        if(file_type_origin == "image/jpeg" || file_type_origin == "image/png" || file_type_origin == "image/gif"){
                            file_type = "圖片";
                        }else{
                            file_type = "文件";
                        }

                        fs.rename(req.files[i].path, "./public/upload_file/group"+groups_id_groups+"/groups_member_"+member_id_member+"/"+originalname , function(err) {
                            if (err) {
                                throw err;
                            } 
                        })

                        fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:originalname, file_type:file_type, file_share:file_share, member_id_member:member_id_member, member_name:member_name});

                    }
                    return resource.addFile(fileDataArray)
                    .then(function(insertFile){
                        res.send({message:"true", fileDataArray:insertFile})
                    })
                    
                }else{
                    res.send({message:"same", sameFile:result})
                }
            })
        }
        
    }

});

//上傳個人或小組連結
router.post('/addLink', function(req, res, next){
    var groups_id_groups = req.body.groups_id_groups;
    var file_share = req.body.file_share;
    var node_id_node = req.body.node_id_node;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var file_name = req.body.file_name;
    var file_type = "連結"
    // var fileslength = req.files.length;
    // var fileData = req.files;
    var fileDataArray=[];

    if(!member_id_member){
        res.send({message: "false"});
    }else{
        fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_share:file_share, member_id_member:member_id_member, member_name:member_name});
        resource.addFile(fileDataArray)
        .then(function(insertFile){
            res.send({message:"true", fileDataArray:insertFile})
        })
    }

});

//刪除連結或檔案
router.post('/deleteFile', function(req, res, next){
    var member_id_member = req.session.member_id;
    var groups_id_groups = req.body.groups_id_groups;
    var file_id = req.body.file_id;
    var file_name = req.body.file_name;
    var file_type = req.body.file_type;
    var file_share = req.body.file_share;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        resource.deleteFile(file_id)
        .then(function(result){
            if(file_type != "連結"){
                if(file_share == 0){
                    var path = "./public/upload_file/group"+groups_id_groups+"/groups_file/"+file_name;
                    if(fs.existsSync(path)){
                        fs.unlinkSync(path);
                    }
                }else{
                    var path = "./public/upload_file/group"+groups_id_groups+"/groups_member_"+member_id_member+"/"+file_name;
                    if(fs.existsSync(path)){
                        fs.unlinkSync(path);
                    }
                } 
                res.send({message:"true"});
            }else{
                res.send({message:"true"});
            }
        })
    }
})

router.post('/checkFileExist', function(req, res, next){
    var file_id = req.body.file_id;
    var member_id_member = req.session.member_id;
    var file_name = req.body.file_name;
    var file_share = req.body.file_share;
    var groups_id_groups = req.body.groups_id_groups;
    var fileDataArray=[];
    if(!member_id_member){
        res.send({message: "false"});
    }else{
        fileDataArray.push({originalname:file_name})
        if(file_share == 0){
            resource.existsFileCheckPersonal(groups_id_groups, member_id_member, fileDataArray)
            .then(function(result){
                if (result == 0 || result.length == 0){
                    res.send({message:"true"})
                }else{
                    res.send({message:"same", sameFile:result})
                }
            })
        }else{
            resource.existsFileCheck(groups_id_groups, fileDataArray)
            .then(function(result){
                console.log(result);
                if (result == 0 || result.length == 0){
                    res.send({message:"true"})
                }else{
                    res.send({message:"same", sameFile:result})
                }
            })
        }
    }

})

module.exports = router;