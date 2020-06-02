var express = require('express');
var router = express.Router();
var project = require('../models/project');
var projectDiscussion = require('../models/projectDiscussion');
var convergence = require('../models/convergence');
var fs = require("fs");
var multer = require("multer");

//定義檔案上傳的臨時資料夾
var upload = multer({
    dest: './public/temp_uploads'
});

//summernote圖片上傳用POST
router.post('/summernoteUploadImage/:gid', upload.array('imageData',5), function(req, res, next) {
    var gid = req.params.gid;
    var imageUrlArray = [];
    //console.log(gid);

    //console.log(req.files.length);
    for (var i = 0; i < req.files.length; i++) {
        // 圖片會放在uploads資料夾並且沒有附檔名，需要自己轉存，用到fs模組
        // 對臨時檔案轉存，fs.rename(oldPath, newPath,callback);
        var originalname = req.files[i].originalname;
        var today = new Date();
        fs.rename(req.files[i].path, "./public/upload_file/group"+gid+"/summernote/" + today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds() +originalname , function(err) {
            if (err) {
                throw err;
            }
            
            
        })
        var imageUrl =  "/upload_file/group"+gid+"/summernote/"+ today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds()+ originalname;
        imageUrlArray.push({newUrl:imageUrl});
    };
    var result = {};
    result.status = "seccess";
    result.imageUrl =  imageUrlArray;
    console.log(result.imageUrl);
    //console.log(result.length);
    res.send(result);
    res.end();
})

//進入組別實作頁面
router.get('/:gid/:mode/:mode2',function(req, res, next) {
    var gid = req.params.gid;
    //var gname = req.query.gname;
    var member_id = req.session.member_id;
    var mode = req.params.mode;
    var mode2 = req.params.mode2;
    //要記得寫登入的人是否有進入該gid的權限判斷!!!

    if(!member_id){
        res.redirect('/');
    }
    else {
        var groups_stage = [];
        var referenceArray = [];
        var researchTitleArray = [];
        var researchMotivationArray = [];
        var researchPurposesArray = [];
        var researchExperimentArray = [];
        var researchMaterialArray = [];
        var researchRecordArray = [];
        var researchAnalysisArray = [];
        var researchDiscussionArray = [];
        var researchConclusionArray = [];
        var groupsAllNodeDataArray = [];
        var groupsAllEdgeDataArray = [];
        var groupsCreateStudentId= [];
        var groupsStageCheck;
        var groups_name;
        project.selectAllStageCheck(gid)
        .then(function(allStageCheck){
            groupsStageCheck = allStageCheck.length;
            return projectDiscussion.selectAllGroupsEdge(gid)
        })
        .then(function(allGroupsEdge){
            if(allGroupsEdge){
                for(var e = 0; e < allGroupsEdge.length; e++){
                    var from = allGroupsEdge[e].edge_from;
                    var to = allGroupsEdge[e].edge_to;
                    allGroupsEdgeData = {from:from, to:to};
                    groupsAllEdgeDataArray.push(allGroupsEdgeData);
                }
            }
            return projectDiscussion.selectAllGroupsNode(gid)
        })
        .then(function(allGroupsNode){
            if(allGroupsNode){
                for (var d = 0; d < allGroupsNode.length; d++){
                    // var day = new Date(allGroupsNode[d].node_createtime);
                    var id = allGroupsNode[d].node_id;
                    var group = allGroupsNode[d].node_type;
                    var x = allGroupsNode[d].node_x;
                    var y = allGroupsNode[d].node_y;
                    var member_id = allGroupsNode[d].member_id_member;
                    var member_name = allGroupsNode[d].member_name;
                    var node_title = allGroupsNode[d].node_title;
                    var node_tag = allGroupsNode[d].node_tag;
                    // var node_createtime_month = day.getMonth()+1;
                    // var node_createtime = day.getFullYear()+'/'+node_createtime_month+'/'+day.getDate();
                    var node_createtime = allGroupsNode[d].node_createtime2;
                    var node_revised_count = allGroupsNode[d].node_revised_count;
                    var node_read_count = allGroupsNode[d].node_read_count;
                    var file_count = allGroupsNode[d].file_count;
                    allGroupsNodeData = {id:id, group:group, x:x, y:y, member_id:member_id, member_name:member_name, node_title:node_title, node_tag:node_tag, node_createtime:node_createtime, node_revised_count:node_revised_count, node_read_count:node_read_count, file_count:file_count};
                    groupsAllNodeDataArray.push(allGroupsNodeData);
                }
            }
            return project.selectGroupsStage(gid)
            //抓取小組現在編輯階段
        })
        .then(function(groupsData){
            // console.log(groupsData);
            var groupsStageData = groupsData[0].groups_stage;
            var groups_create_student_id = groupsData[0].member_id_student_member;
            groups_name = groupsData[0].groups_name;
            groups_stage.push(groupsStageData);
            groupsCreateStudentId.push(groups_create_student_id);
            return project.selectResearchConclusion(gid)
        })
        //抓取專題實作內容資料
        .then(function(researchConclusion){
            if(researchConclusion){
                for (var c = 0; c < researchConclusion.length; c++){
                    var researchConclusionData = researchConclusion[c].project_data_content;
                    researchConclusionArray.push(researchConclusionData);
                }
            }
            return project.selectResearchDiscussion(gid)
        })
        .then(function(researchDiscussion){
            if(researchDiscussion){
                for (var n = 0; n < researchDiscussion.length; n++){
                    var project_data_id = researchDiscussion[n].project_data_id;
                    var groups_id_groups = researchDiscussion[n].groups_id_groups;
                    var project_data_content = researchDiscussion[n].project_data_content;
                    var member_id_member = researchDiscussion[n].member_id_member;
                    var member_name = researchDiscussion[n].member_name;
                    var researchDiscussionData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
                    researchDiscussionArray.push(researchDiscussionData);
                    // console.log(researchDiscussionArray);
                } 
            }
            return project.selectResearchAnalysis(gid)
        })
        .then(function(researchAnalysis){
            if(researchAnalysis){
                for (var m = 0; m < researchAnalysis.length; m++){
                    var project_data_multi_id = researchAnalysis[m].project_data_multi_id;
                    var groups_id_groups = researchAnalysis[m].groups_id_groups;
                    var project_data_multi_correspond = researchAnalysis[m].project_data_multi_correspond;
                    var project_data_multi_title = researchAnalysis[m].project_data_multi_title;
                    var project_data_multi_content = researchAnalysis[m].project_data_multi_content;
                    var member_id_member = researchAnalysis[m].member_id_member;
                    var member_name = researchAnalysis[m].member_name;
                    var researchAnalysisData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
                    researchAnalysisArray.push(researchAnalysisData);
                    //console.log(researchAnalysisArray);
                } 
            }
            return project.selectResearchRecord(gid)
        })
        .then(function(researchRecord){
            if(researchRecord){
                for (var l = 0; l < researchRecord.length; l++){
                    var project_data_multi_id = researchRecord[l].project_data_multi_id;
                    var groups_id_groups = researchRecord[l].groups_id_groups;
                    var project_data_multi_correspond = researchRecord[l].project_data_multi_correspond;
                    var project_data_multi_title = researchRecord[l].project_data_multi_title;
                    var project_data_multi_content = researchRecord[l].project_data_multi_content;
                    var member_id_member = researchRecord[l].member_id_member;
                    var member_name = researchRecord[l].member_name;
                    var researchRecordData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
                    researchRecordArray.push(researchRecordData);
                    //console.log(researchRecordArray)
                }
            }
            return project.selectResearchMaterial(gid)
        })
        .then(function(researchMaterial){
            if(researchMaterial){
                for (var k = 0; k< researchMaterial.length; k++){
                    var material_id = researchMaterial[k].material_id;
                    var groups_id_groups = researchMaterial[k].groups_id_groups;
                    var material_name = researchMaterial[k].material_name;
                    var material_amount = researchMaterial[k].material_amount;
                    var material_img_url = researchMaterial[k].material_img_url;
                    var member_id_member = researchMaterial[k].member_id_member;
                    var member_name = researchMaterial[k].member_name;
                    var researchMaterialData = {material_id:material_id, groups_id_groups:groups_id_groups, material_name:material_name, material_amount:material_amount, material_img_url:material_img_url, member_id_member:member_id_member, member_name:member_name};
                    researchMaterialArray.push(researchMaterialData);
                    //console.log(researchPurposesArray);
                }
            }
            return project.selectResearchExperiment(gid)
        })
        .then(function(researchExperiment){
            if(researchExperiment){
                for (var j = 0; j < researchExperiment.length; j++){
                    var project_data_multi_id = researchExperiment[j].project_data_multi_id;
                    var groups_id_groups = researchExperiment[j].groups_id_groups;
                    var project_data_multi_correspond = researchExperiment[j].project_data_multi_correspond;
                    var project_data_multi_title = researchExperiment[j].project_data_multi_title;
                    var project_data_multi_content = researchExperiment[j].project_data_multi_content;
                    var member_id_member = researchExperiment[j].member_id_member;
                    var member_name = researchExperiment[j].member_name;
                    var researchExperimentData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
                    researchExperimentArray.push(researchExperimentData);
                    //console.log(researchExperimentArray)
                }
            }
            return project.selectResearchPurposes(gid)
        })
        .then(function(researchPurposes){
            if(researchPurposes){
                for (var i = 0; i < researchPurposes.length; i++){
                    var project_data_id = researchPurposes[i].project_data_id;
                    var groups_id_groups = researchPurposes[i].groups_id_groups;
                    var project_data_content = researchPurposes[i].project_data_content;
                    var member_id_member = researchPurposes[i].member_id_member;
                    var member_name = researchPurposes[i].member_name;
                    var researchPurposesData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
                    researchPurposesArray.push(researchPurposesData);
                    //console.log(researchPurposesArray);
                }
            }
            return project.selectResearchMotivation(gid)
        })
        .then(function(researchMotivation){
            if(researchMotivation){
                for (var a = 0; a < researchMotivation.length; a++){
                    var researchMotivationData = researchMotivation[a].project_data_content;
                    researchMotivationArray.push(researchMotivationData);
                }
            }
            return project.selectResearchTitleData(gid)
        })
        .then(function(researchTitle){
            if(researchTitle){
                for (var b = 0; b < researchTitle.length; b++){
                    var researchTitleData = researchTitle[b].project_data_content;
                    researchTitleArray.push(researchTitleData);
                }
            }
            return project.selectReferenceData(gid)
        })
        .then(function(reference){
            if(reference){
                for (var e = 0; e < reference.length; e++){
                    var reference_id = reference[e].reference_id;
                    var reference_type = reference[e].reference_type;
                    var reference_content = reference[e].reference_content;
                    var referenceData = {reference_id:reference_id, reference_type:reference_type, reference_content:reference_content};
                    referenceArray.push(referenceData);
                }
            }
            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, groups_name:groups_name, mode:mode, mode2:mode2, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitleArray, researchMotivation:researchMotivationArray, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray, researchConclusion:researchConclusionArray, groups_stage:groups_stage, AllNodeData:groupsAllNodeDataArray, reference: referenceArray, edge:groupsAllEdgeDataArray, groups_create_student_id:groupsCreateStudentId, groupsStageCheck:groupsStageCheck});
        })
    }
});

//新增或修改研究題目和研究動機
router.post('/updateResearchTitle', function(req, res, next){
    var gid = req.body.gid;
    var project_data_type1 = "研究題目";
    var project_data_type2 = "研究動機";
    var project_data_content1 = req.body.project_data_content1; //研究題目的內容
    var project_data_content2 = req.body.project_data_content2; //研究動機的內容
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "研究題目與動機";
    var node_tag = "研究動機";
    var node_type = "motivation";

    // console.log(req.body);

    if(!member_id_member){
        res.send({message:"false"});
        // res.redirect('/');
        // alert('帳號已被系統自動登出，請重新登入')
    }else{
        var researchTitle;

        project.selectResearchTitleData(gid)
        .then(function(researchTitleData){
            researchTitle = researchTitleData;
            return project.selectResearchMotivation(gid)
        })
        .then(function(researchMotivation){
            if(researchTitle.length == 1 && researchMotivation.length == 1){
                return project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name)
                .then(function(result){
                    return project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name)
                })
                .then(function(result2){
                    if(result2){
                        res.send({message:"true"});
                    }
                })
            }else if(researchTitle.length == 0 && researchMotivation.length == 1){
                return project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name)
                .then(function(result){
                    return project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name)
                })
                .then(function(result2){
                    if(result2){
                        res.send({message:"true"});
                    }
                })
            }else if(researchTitle.length == 1 && researchMotivation.length == 0){
                return project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name)
                .then(function(result){
                    return project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name)
                })
                .then(function(result2){
                    if(result2){
                        res.send({message:"true"});
                    }
                })
            }else if(researchTitle.length == 0 && researchMotivation.length == 0){
                return project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name)
                .then(function(result){
                    return project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name)
                })
                .then(function(result2){
                    if(result2){
                        res.send({message:"true"});
                        // return projectDiscussion.selectProjectDataNode(gid, node_type)
                    }
                })
                // .then(function(selectNode){
                //     console.log(selectNode.length);
                //     if(selectNode.length != 0){
                //         res.send({message:"true"});
                //     }else{
                //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag , node_type)
                //         .then(function(addNode){
                //             res.send({message:"true"});
                //         })
                //     }
                // })
            }
        })
    }
});

//新增研究目的
router.post('/addPurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_type = "研究目的";
    var project_data_content = req.body.project_data_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "研究目的";
    var node_tag = "研究目的";
    var node_type = "purposes";

    console.log(gid);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
                res.send({message:"true"});
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改研究目的
router.post('/editPurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_id = req.body.project_data_id; //該筆研究目的在資料表中的資料id
    var project_data_type = "研究目的";
    var project_data_type2 = "實驗項目";
    var project_data_content = req.body.project_data_content; //研究目的的內容
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        var origin_data;
        project.selectPurposeEdit(project_data_id)
        .then(function(result){
            origin_data = result[0].project_data_content;
            return project.updateProjectDataContentForMany(gid, project_data_id, project_data_type, project_data_content, member_id_member, member_name)
        })
        .then(function(result2){
            return project.updateProjectDataCorrespond(gid, project_data_type2, origin_data, project_data_content)
        })
        .then(function(result3){
            if (result3){
                res.send({message:"true"});
            }
        })
    }
});

//刪除研究目的
router.post('/deletePurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_id = req.body.project_data_id; //該筆研究目的在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        var origin_data;
        
        project.selectPurposeEdit(project_data_id)
        .then(function(result){
            origin_data = result[0].project_data_content;
            return project.selectCorrespondNeedDelete(origin_data)
        })
        .then(function(result2){
            // var needUpdateDataArray = [];
            var needUpdateDataArray;
            var newDataArray = [];
            for(var i = 0; i < result2.length; i++){
                var newCorrespondDataArray = [];
                var needUpdateData = result2[i].project_data_multi_correspond;
                needUpdateDataArray = needUpdateData.split(',');
                var project_data_multi_id = result2[i].project_data_multi_id;

                for(var j = 0; j < needUpdateDataArray.length; j++){
                    if(needUpdateDataArray[j] != origin_data){
                        newCorrespondDataArray.push(needUpdateDataArray[j]);
                    }
                }
                var newCorrespondData = newCorrespondDataArray.toString();
                // console.log(needUpdateDataArray);
                // console.log(newCorrespondDataArray);     
                var newData = {gid:gid, project_data_multi_id:project_data_multi_id, newCorrespondData:newCorrespondData}
                newDataArray.push(newData);

            }
            console.log(newDataArray);
            return project.updatePurposesDeleteCorrespond(newDataArray)
        })
        .then(function(result3){
            return project.deleteProjectDataContentForMany(project_data_id)
        })
        .then(function(result4){
            res.send({message:"true"});
        })
    }
});

//新增實驗項目
router.post('/addExperiment',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_type = "實驗項目";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = req.body.project_data_multi_title;
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "實驗項目";
    var node_tag = "實驗項目";
    var node_type = "experiment";

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改實驗項目
router.post('/editExperiment',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_id = req.body.project_data_multi_id; //該筆實驗項目在資料表中的資料id
    var project_data_multi_type = "實驗項目";
    var project_data_multi_type2 = "實驗記錄";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = req.body.project_data_multi_title;
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        var origin_data;
        //先把修改過的實驗項目標題select出來
        project.selectExperimentEdit(project_data_multi_id)
        .then(function(result){
            origin_data = result[0].project_data_multi_title;
            //update該筆要修改的實驗項目資料
            return project.updateProjectDataMultiContentForMany(gid, project_data_multi_id, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        })
        .then(function(result2){
            //update該筆修改過的實驗項目標題對應紀錄的實驗記錄
            return project.updateProjectDataCorrespond(gid,project_data_multi_type2, origin_data, project_data_multi_title)
        })
        .then(function(result3){
            if (result3){
                // console.log(result3);
                res.send({message:"true"});
            }
        })
    }
});

//刪除實驗項目
router.post('/deleteExperiment',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_id = req.body.project_data_multi_id; //該筆實驗項目在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        var origin_data;
        
        project.selectExperimentEdit(project_data_multi_id)
        .then(function(result){
            origin_data = result[0].project_data_multi_title;
            return project.selectCorrespondNeedDelete(origin_data)
        })
        .then(function(result2){
            // var needUpdateDataArray = [];
            var needUpdateDataArray;
            var newDataArray = [];
            for(var i = 0; i < result2.length; i++){
                var newCorrespondDataArray = [];
                var needUpdateData = result2[i].project_data_multi_correspond;
                needUpdateDataArray = needUpdateData.split(',');
                var project_data_multi_id2 = result2[i].project_data_multi_id;

                for(var j = 0; j < needUpdateDataArray.length; j++){
                    if(needUpdateDataArray[j] != origin_data){
                        newCorrespondDataArray.push(needUpdateDataArray[j]);
                    }
                }
                var newCorrespondData = newCorrespondDataArray.toString();   
                var newData = {gid:gid, project_data_multi_id:project_data_multi_id2, newCorrespondData:newCorrespondData}
                newDataArray.push(newData);

            }
            console.log(newDataArray);
            return project.updatePurposesDeleteCorrespond(newDataArray)
        })
        .then(function(result3){
            return project.deleteProjectDataMultiContentForMany(project_data_multi_id)
        })
        .then(function(result4){
            res.send({message:"true"});
        })
    }
});

//新增研究設備及器材
router.post('/addMaterial',function(req, res, next) {
    var gid = req.body.gid;
    var material_name = req.body.material_name;
    var material_amount = req.body.material_amount;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "研究設備及器材";
    var node_tag = "研究設備及器材";
    var node_type = "material";


    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addMaterial(gid, material_name, material_amount, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改研究設備及器材
router.post('/editMaterial',function(req, res, next) {
    var gid = req.body.gid;
    var material_id = req.body.material_id;
    var material_name = req.body.material_name;
    var material_amount = req.body.material_amount;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.updateMaterialForMany(gid, material_id, material_name, material_amount, member_id_member, member_name)
        .then(function(result){
            if (result){
                // console.log(result3);
                res.send({message:"true"});
            }
        })
    }
});

//刪除研究設備及器材
router.post('/deleteMaterial',function(req, res, next) {
    var material_id = req.body.material_id; //該筆實驗項目在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{

        project.deleteMaterialForMany(material_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }
});

//新增實驗記錄
router.post('/addRecord',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_type = "實驗記錄";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = "";
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "實驗記錄";
    var node_tag = "實驗記錄";
    var node_type = "record";

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改實驗記錄
router.post('/editRecord',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_id = req.body.project_data_multi_id; //該筆實驗記錄在資料表中的資料id
    var project_data_multi_type = "實驗記錄";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = "";
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.updateProjectDataMultiContentForMany(gid, project_data_multi_id, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if (result){
                // console.log(result3);
                res.send({message:"true"});
            }
        })
    }
});

//刪除實驗記錄
router.post('/deleteRecord',function(req, res, next) {
    var project_data_multi_id = req.body.project_data_multi_id; //該筆實驗記錄在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.deleteProjectDataMultiContentForMany(project_data_multi_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }
});

//新增分析項目(研究結果)
router.post('/addAnalysis',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_type = "研究結果";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = "";
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "研究結果(分析及圖表)";
    var node_tag = "研究結果(分析及圖表)";
    var node_type = "analysis";

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改分析項目(研究結果)
router.post('/editAnalysis',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_multi_id = req.body.project_data_multi_id; //該筆分析項目在資料表中的資料id
    var project_data_multi_type = "研究結果";
    var project_data_multi_correspond = req.body.project_data_multi_correspond;
    var project_data_multi_title = "";
    var project_data_multi_content = req.body.project_data_multi_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.updateProjectDataMultiContentForMany(gid, project_data_multi_id, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if (result){
                // console.log(result3);
                res.send({message:"true"});
            }
        })
    }
});

//刪除分析項目(研究結果)
router.post('/deleteAnalysis',function(req, res, next) {
    var project_data_multi_id = req.body.project_data_multi_id; //該筆實驗記錄在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.deleteProjectDataMultiContentForMany(project_data_multi_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }
});

//新增討論
router.post('/addDiscussion',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_type = "討論";
    var project_data_content = req.body.project_data_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "討論";
    var node_tag = "討論";
    var node_type = "discussion";

    console.log(gid);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                // return projectDiscussion.selectProjectDataNode(gid, node_type)
                res.send({message:"true"});
            }
        })
        // .then(function(selectNode){
        //     if(selectNode.length != 0){
        //         res.send({message:"true"});
        //     }else{
        //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
        //         .then(function(addNode){
        //             res.send({message:"true"});
        //         })
        //     }
        // })
    }
});

//修改討論
router.post('/editDiscussion',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_id = req.body.project_data_id; //該筆討論在資料表中的資料id
    var project_data_type = "討論";
    var project_data_content = req.body.project_data_content; //討論的內容
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.updateProjectDataContentForMany(gid, project_data_id, project_data_type, project_data_content, member_id_member, member_name)
        .then(function(result){
            if (result){
                res.send({message:"true"});
            }
        })
    }
});

//刪除討論
router.post('/deleteDiscussion',function(req, res, next) {
    var project_data_id = req.body.project_data_id; //該筆研究目的在資料表中的資料id
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.deleteProjectDataContentForMany(project_data_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }
});

//新增或修改結論
router.post('/updateConclusion', function(req, res, next){
    var gid = req.body.gid;
    var project_data_type = "結論";
    var project_data_content = req.body.project_data_content; //結論的內容
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    var node_title = "結論";
    var node_tag = "結論";
    var node_type = "conclusion";

    if(!member_id_member){
        res.send({message:"false"});

    }else{
        var researchConculsion;

        project.selectResearchConclusion(gid)
        .then(function(researchConculsionData){
            researchConculsion = researchConculsionData;
            if(researchConculsion.length == 1){
                return project.updateProjectDataContentForOne(gid, project_data_type, project_data_content, member_id_member, member_name)
                .then(function(result){
                    if(result){
                        res.send({message:"true"});
                    }
                })
            }else if(researchConculsion.length == 0){
                return project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name)
                .then(function(result2){
                    if(result2){
                        // console.log(result.insertId);
                        // return projectDiscussion.selectProjectDataNode(gid, node_type)
                        res.send({message:"true"});
                    }
                })
                // .then(function(selectNode){
                //     if(selectNode.length != 0){
                //         res.send({message:"true"});
                //     }else{
                //         return projectDiscussion.addProjectDataNode(gid, member_id_member, member_name, node_title, node_tag, node_type)
                //         .then(function(addNode){
                //             res.send({message:"true"});
                //         })
                //     }
                // })
            }
        })
    }
});

//修改組別編輯階段，並新增階段切換紀錄
router.post('/stageSwitch',function(req, res, next){
    var member_id_member = req.session.member_id;
    var gid = req.body.gid;
    var stage_switch_now = req.body.stage_switch_now;
    var stage_after = req.body.stage_after;
    var stage_switch_reason = req.body.stage_switch_reason;
    var stage_switch_status = "通過";

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.updateStage(gid, stage_after)
        .then(function(result){
            return project.addStageSwitchRecord(gid, stage_switch_now, stage_after, stage_switch_reason, stage_switch_status)
        })
        .then(function(result2){
            res.send({message:"true"});
        })
    }
});

//新增參考資料
router.post('/addReference',function(req, res, next) {
    var groups_id_groups = req.body.groups_id_groups;
    var reference_type = req.body.reference_type;
    var reference_content = req.body.reference_content;
    var member_id_member = req.session.member_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else if(reference_content == ""){
        res.send({message:"null"});
    }else{
        project.addReference(groups_id_groups, reference_type, reference_content)
        .then(function(result){
            if(result){
                res.send({message:"true"});
            }
        })
    }
});

//刪除參考資料
router.post('/deleteReference', function(req, res, next){
    var reference_id = req.body.reference_id;
    var member_id_member = req.session.member_id;
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.deleteReference(reference_id)
        .then(function(result){
            res.send({message:"true"});
        })
    }
});

//新增階段檢核資料
router.post('/updateStageCheck', function(req, res, next){
    var gid = req.body.gid;
    var stage_check_stage = req.body.stage_check_stage;
    var stage_check_status = req.body.stage_check_status;
    var member_id_member = req.session.member_id;
    var stageCheck;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.selectStageCheck(gid, stage_check_stage)
        .then(function(stageCheckData){
            stageCheck = stageCheckData;
            if(stageCheck.length == 0){
                return project.addStageCheck(gid, stage_check_stage, stage_check_status)
                .then(function(result){
                    res.send({message:"true"});
                })
            }else{
                return project.updateStageCheck(gid, stage_check_stage, stage_check_status)
                .then(function(result){
                    res.send({message:"true"});
                })
            }
        })
    }
});


//想法討論區router

//新增想法節點
router.post('/discussion/addIdea', upload.array('files',5), function(req, res, next){
    var groups_id_groups = req.body.gid;
    var node_title = req.body.node_title;
    var node_tag = req.body.node_tag;
    var node_type = req.body.node_type;
    var idea_content = req.body.idea_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var fileslength = req.files.length;
    var fileData = req.files;
    var node_id_node;
    var fromNodeIdString = req.body.fromNodeId;
    var fromNodeId = fromNodeIdString.split(',');
    var nodeDataSelect = [];
    var edgeDataSelect = [];

    if(!member_id_member){
        res.send({message:"false"});
    }else if(node_title==""){
        res.send({message:"nullContent"});
    }else{
        console.log(req.body)
        console.log(req.files)
        projectDiscussion.existsFileCheck(groups_id_groups, fileData)
        .then(function(result){
            if (result == 0 || result.length == 0){
                return projectDiscussion.addNode(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type)
                .then(function(result2){
                    console.log(result2.insertId);
                    node_id_node = result2.insertId;
                    return projectDiscussion.addIdea(node_id_node, idea_content)
                })
                .then(function(result3){
                    var edgeDataArray = [];
                    if(fromNodeId.length > 0){
                        for(var j = 0;j < fromNodeId.length; j++){
                            var edge_from = fromNodeId[j];
                            edgeDataArray.push({edge_from:edge_from, edge_to:node_id_node, groups_id_groups:groups_id_groups});
                        }
                        //console.log(edgeDataArray);
                        return projectDiscussion.addEdge(edgeDataArray)
                    }
                })
                .then(function(result4){
                    return projectDiscussion.selectNewNodeData(node_id_node)
                })
                .then(function(nodeData){
                    if(nodeData){
                        for (var k = 0; k < nodeData.length; k++){
                            // var day = new Date(allGroupsNode[d].node_createtime);
                            var id = nodeData[k].node_id;
                            var group = nodeData[k].node_type;
                            var x = nodeData[k].node_x;
                            var y = nodeData[k].node_y;
                            var member_id = nodeData[k].member_id_member;
                            var member_name = nodeData[k].member_name;
                            var node_title = nodeData[k].node_title;
                            var node_tag = nodeData[k].node_tag;
                            var node_createtime = nodeData[k].node_createtime2;
                            var node_revised_count = nodeData[k].node_revised_count;
                            var node_read_count = nodeData[k].node_read_count;
                            allNodeData = {id:id, group:group, x:x, y:y, member_id:member_id, member_name:member_name, node_title:node_title, node_tag:node_tag, node_createtime:node_createtime, node_revised_count:node_revised_count, node_read_count:node_read_count};
                            nodeDataSelect.push(allNodeData);
                        }
                    }
                    //nodeDataSelect = nodeData;
                    return projectDiscussion.selectNewEdgeData(node_id_node)
                })
                .then(function(edgeData){
                    if(edgeData){
                        for(var e = 0; e < edgeData.length; e++){
                            var from = edgeData[e].edge_from;
                            var to = edgeData[e].edge_to;
                            allEdgeData = {from:from, to:to};
                            edgeDataSelect.push(allEdgeData);
                        }
                    }
                    //edgeDataSelect = edgeData;
                    var fileDataArray = [];
                    if(fileslength != 0){
                        for (var i = 0; i < fileslength; i++) {
                            // 檔案會放在uploads資料夾並且沒有附檔名，需要自己轉存，用到fs模組
                            // 對臨時檔案轉存，fs.rename(oldPath, newPath,callback);
                            var originalname = req.files[i].originalname;
                            var file_type_origin = req.files[i].mimetype;
                            console.log(file_type_origin);
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
                            fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:originalname, file_type:file_type, member_id_member:member_id_member, member_name:member_name});
                        };
                        return projectDiscussion.addFile(fileDataArray)
                        .then(function(result4){
                            res.send({message:"true", nodeData:nodeDataSelect, edgeData:edgeDataSelect});
                        })
                    }else{
                        res.send({message:"true", nodeData:nodeDataSelect, edgeData:edgeDataSelect});
                    }
                })
            }
            else if(result.length != 0){
                res.send({message:"same", sameFile:result})
            }
        })
    }
});


//抓取想法節點資料
router.get('/:gid/:mode/discussion/readIdea', function(req, res, next){
    var node_id_node = req.query.nodeId;
    var member_id_member = req.session.member_id;
    var nodeData;
    var nodeFile;
    console.log(node_id_node);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        projectDiscussion.getNodeData(node_id_node)
        .then(function(result){
            nodeData = result;
            console.log(nodeData);
            return projectDiscussion.getNodeFile(node_id_node)
        })
        .then(function(result2){
            nodeFile = result2;
            var node_read_count = nodeData[0].node_read_count+1;
            return projectDiscussion.updateNodeReadCount(node_id_node, node_read_count)
            
        })
        .then(function(result2){
            res.send({message:"true", nodeData:nodeData, nodeFile:nodeFile});
        })
    }
});

//刪除想法節點中的檔案
router.post('/:gid/:mode/discussion/deleteFile', function(req, res, next){
    var member_id_member = req.session.member_id;
    var gid = req.params.gid;
    var file_id = req.body.file_id;
    var file_name = req.body.file_name;
    var filePath = "./public/upload_file/group"+gid+"/groups_file/"+file_name;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        projectDiscussion.deleteFile(file_id)
        .then(function(result){
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
            res.send({message:"true"});
        })
    }
})

//編輯想法節點
router.post('/:gid/:mode/discussion/editIdeaNode', upload.array('files',5), function(req, res, next){
    var groups_id_groups = req.params.gid;
    var node_title = req.body.node_title;
    var node_tag = req.body.node_tag;
    var idea_content = req.body.idea_content;
    var member_id_member = req.session.member_id;
    var fileslength = req.files.length;
    var fileData = req.files;
    var node_id = req.body.node_id;
    var nodeDataSelect = [];

    if(!member_id_member){
        res.send({message:"false"});
    }else if(node_title==""){
        res.send({message:"nullContent"});
    }else{
        projectDiscussion.existsFileCheck(groups_id_groups, fileData)
        .then(function(result){
            if (result == 0 || result.length == 0){
                return projectDiscussion.updateNode(node_id, node_title, node_tag)
                .then(function(result2){
                    return projectDiscussion.updateIdea(node_id, idea_content)
                })
                .then(function(result3){
                    return projectDiscussion.selectNewNodeData(node_id)
                })
                .then(function(nodeData){
                    if(nodeData){
                        for (var k = 0; k < nodeData.length; k++){
                            // var day = new Date(allGroupsNode[d].node_createtime);
                            var id = nodeData[k].node_id;
                            var group = nodeData[k].node_type;
                            var x = nodeData[k].node_x;
                            var y = nodeData[k].node_y;
                            var member_id = nodeData[k].member_id_member;
                            var member_name = nodeData[k].member_name;
                            var node_title = nodeData[k].node_title;
                            var node_tag = nodeData[k].node_tag;
                            var node_createtime = nodeData[k].node_createtime2;
                            var node_revised_count = nodeData[k].node_revised_count;
                            var node_read_count = nodeData[k].node_read_count;
                            allNodeData = {id:id, group:group, x:x, y:y, member_id:member_id, member_name:member_name, node_title:node_title, node_tag:node_tag, node_createtime:node_createtime, node_revised_count:node_revised_count, node_read_count:node_read_count};
                            nodeDataSelect.push(allNodeData);
                        }
                    }
                    var fileDataArray = [];
                    if(fileslength != 0){
                        for (var i = 0; i < fileslength; i++) {
                            // 檔案會放在uploads資料夾並且沒有附檔名，需要自己轉存，用到fs模組
                            // 對臨時檔案轉存，fs.rename(oldPath, newPath,callback);
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
                            fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id, file_name:originalname, file_type:file_type, member_id_member:member_id_member, member_name:member_name});
                        };
                        return projectDiscussion.addFile(fileDataArray)
                        .then(function(result4){
                            res.send({message:"true",nodeData:nodeDataSelect});
                        })
                    }else{
                        res.send({message:"true",nodeData:nodeDataSelect});
                    }
                })
            }
            else if(result.length != 0){
                res.send({message:"same", sameFile:result})
            }
        })
    }
})

//新增參考文獻節點
router.post('/discussion/addReferenceNode', upload.array('files',5), function(req, res, next){
    var groups_id_groups = req.body.gid;
    var node_title = req.body.node_title;
    var node_tag = req.body.node_tag;
    var node_type = "reference";
    var reference_node_type = req.body.reference_node_type;
    var reference_node_content = req.body.reference_node_content;
    var reference_node_idea = req.body.reference_node_idea;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var fileslength = req.files.length;
    var fileData = req.files;
    var node_id_node;
    var fromNodeIdString = req.body.fromNodeId;
    var fromNodeId = fromNodeIdString.split(',');
    var nodeDataSelect = [];
    var edgeDataSelect = [];

    if(!member_id_member){
        res.send({message:"false"});
    }else if(node_title==""){
        res.send({message:"nullContent"});
    }else{
        console.log(req.body)
        console.log(req.files)
        projectDiscussion.existsFileCheck(groups_id_groups, fileData)
        .then(function(result){
            if (result == 0 || result.length == 0){
                return projectDiscussion.addNode(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type)
                .then(function(result2){
                    console.log(result2.insertId);
                    node_id_node = result2.insertId;
                    return projectDiscussion.addReferenceNode(node_id_node, groups_id_groups, reference_node_type, reference_node_content, reference_node_idea)
                })                
                .then(function(result3){
                    var edgeDataArray = [];
                    if(fromNodeId.length > 0){
                        for(var j = 0;j < fromNodeId.length; j++){
                            var edge_from = fromNodeId[j];
                            edgeDataArray.push({edge_from:edge_from, edge_to:node_id_node, groups_id_groups:groups_id_groups});
                        }
                        //console.log(edgeDataArray);
                        return projectDiscussion.addEdge(edgeDataArray)
                    }
                })
                .then(function(result4){
                    return projectDiscussion.selectNewNodeData(node_id_node)
                })
                .then(function(nodeData){
                    if(nodeData){
                        for (var k = 0; k < nodeData.length; k++){
                            // var day = new Date(allGroupsNode[d].node_createtime);
                            var id = nodeData[k].node_id;
                            var group = nodeData[k].node_type;
                            var x = nodeData[k].node_x;
                            var y = nodeData[k].node_y;
                            var member_id = nodeData[k].member_id_member;
                            var member_name = nodeData[k].member_name;
                            var node_title = nodeData[k].node_title;
                            var node_tag = nodeData[k].node_tag;
                            var node_createtime = nodeData[k].node_createtime2;
                            var node_revised_count = nodeData[k].node_revised_count;
                            var node_read_count = nodeData[k].node_read_count;
                            allNodeData = {id:id, group:group, x:x, y:y, member_id:member_id, member_name:member_name, node_title:node_title, node_tag:node_tag, node_createtime:node_createtime, node_revised_count:node_revised_count, node_read_count:node_read_count};
                            nodeDataSelect.push(allNodeData);
                        }
                    }
                    //nodeDataSelect = nodeData;
                    return projectDiscussion.selectNewEdgeData(node_id_node)
                })
                .then(function(edgeData){
                    if(edgeData){
                        for(var e = 0; e < edgeData.length; e++){
                            var from = edgeData[e].edge_from;
                            var to = edgeData[e].edge_to;
                            allEdgeData = {from:from, to:to};
                            edgeDataSelect.push(allEdgeData);
                        }
                    }

                    var fileDataArray = [];
                    if(fileslength != 0){
                        for (var i = 0; i < fileslength; i++) {
                            // 檔案會放在uploads資料夾並且沒有附檔名，需要自己轉存，用到fs模組
                            // 對臨時檔案轉存，fs.rename(oldPath, newPath,callback);
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
                            fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:originalname, file_type:file_type, member_id_member:member_id_member, member_name:member_name});
                        };
                        return projectDiscussion.addFile(fileDataArray)
                        .then(function(result4){
                            res.send({message:"true", nodeData:nodeDataSelect, edgeData:edgeDataSelect});
                        })
                    }else{
                        res.send({message:"true", nodeData:nodeDataSelect, edgeData:edgeDataSelect});
                    }
                })
            }
            else if(result.length != 0){
                res.send({message:"same", sameFile:result})
            }
        })
    }
});

//抓取參考文獻節點資料
router.get('/:gid/:mode/discussion/readReference', function(req, res, next){
    var node_id_node = req.query.nodeId;
    var member_id_member = req.session.member_id;
    var nodeData;
    var nodeFile;
    console.log(node_id_node);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        projectDiscussion.getReferenceNodeData(node_id_node)
        .then(function(result){
            nodeData = result;
            console.log(nodeData);
            return projectDiscussion.getNodeFile(node_id_node)
        })
        .then(function(result2){
            nodeFile = result2;
            var node_read_count = nodeData[0].node_read_count+1;
            return projectDiscussion.updateNodeReadCount(node_id_node, node_read_count)
            
        })
        .then(function(result2){
            res.send({message:"true", nodeData:nodeData, nodeFile:nodeFile});
        })
    }
});

//修改參考文獻節點
router.post('/:gid/:mode/discussion/editReferenceNode', upload.array('files',5), function(req, res, next){
    var groups_id_groups = req.body.gid;
    var node_title = req.body.node_title;
    var node_tag = req.body.node_tag;
    var node_type = "reference";
    var reference_node_type = req.body.reference_node_type;
    var reference_node_content = req.body.reference_node_content;
    var reference_node_idea = req.body.reference_node_idea;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var fileslength = req.files.length;
    var fileData = req.files;
    var node_id = req.body.node_id;
    var nodeDataSelect = [];

    if(!member_id_member){
        res.send({message:"false"});
    }else if(node_title==""){
        res.send({message:"nullContent"});
    }else{
        console.log(req.body)
        console.log(req.files)
        projectDiscussion.existsFileCheck(groups_id_groups, fileData)
        .then(function(result){
            if (result == 0 || result.length == 0){
                return projectDiscussion.updateNode(node_id, node_title, node_tag)
                .then(function(result2){
                    return projectDiscussion.updateReferenceNode(node_id, groups_id_groups, reference_node_type, reference_node_content, reference_node_idea)
                })
                .then(function(result3){
                    return projectDiscussion.selectNewNodeData(node_id)
                })
                .then(function(nodeData){
                    if(nodeData){
                        for (var k = 0; k < nodeData.length; k++){
                            // var day = new Date(allGroupsNode[d].node_createtime);
                            var id = nodeData[k].node_id;
                            var group = nodeData[k].node_type;
                            var x = nodeData[k].node_x;
                            var y = nodeData[k].node_y;
                            var member_id = nodeData[k].member_id_member;
                            var member_name = nodeData[k].member_name;
                            var node_title = nodeData[k].node_title;
                            var node_tag = nodeData[k].node_tag;
                            var node_createtime = nodeData[k].node_createtime2;
                            var node_revised_count = nodeData[k].node_revised_count;
                            var node_read_count = nodeData[k].node_read_count;
                            allNodeData = {id:id, group:group, x:x, y:y, member_id:member_id, member_name:member_name, node_title:node_title, node_tag:node_tag, node_createtime:node_createtime, node_revised_count:node_revised_count, node_read_count:node_read_count};
                            nodeDataSelect.push(allNodeData);
                        }
                    }

                    var fileDataArray = [];
                    if(fileslength != 0){
                        for (var i = 0; i < fileslength; i++) {
                            // 檔案會放在uploads資料夾並且沒有附檔名，需要自己轉存，用到fs模組
                            // 對臨時檔案轉存，fs.rename(oldPath, newPath,callback);
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
                            fileDataArray.push({groups_id_groups:groups_id_groups, node_id_node:node_id, file_name:originalname, file_type:file_type, member_id_member:member_id_member, member_name:member_name});
                        };
                        return projectDiscussion.addFile(fileDataArray)
                        .then(function(result4){
                            res.send({message:"true",nodeData:nodeDataSelect});
                        })
                    }else{
                        res.send({message:"true",nodeData:nodeDataSelect});
                    }
                })
            }
            else if(result.length != 0){
                res.send({message:"same", sameFile:result})
            }
        })
    }
});



//想法收斂工具

//選擇要收斂的標籤並撈出相關資料
router.post('/convergence/selectConvergenceTag', function(req, res, next){
    //console.log(req.body);
    var groups_id_groups = req.body.groups_id_groups;
    var tag = req.body.tag;
    var member_id_member = req.session.member_id;
    var convergenceData;
    var nodeListData;
    var convergence_id;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        convergence.selectTagConvergence(groups_id_groups, tag)
        .then(function(convergenceData1){
            convergenceData = convergenceData1;
            if(convergenceData.length == 0){
                return convergence.insertTagConvergence(groups_id_groups, tag)
                .then(function(newConvergenceData){
                    convergence_id = newConvergenceData.insertId;
                    console.log(newConvergenceData.insertId)
                    // res.send({message:"true", convergenceData:convergenceData})
                })
            }else{
                convergence_id = convergenceData[0].convergence_id;
            }
            return convergence.selectTagIdea(groups_id_groups, tag)
            // res.send({message:"true", convergenceData:convergenceData})
        })
        .then(function(nodeListData1){
            nodeListData = nodeListData1;
            return convergence.selectMessage(groups_id_groups, tag)
        })
        .then(function(messageData){
            res.send({message:"true", convergenceData:convergenceData, nodeListData:nodeListData, messageData:messageData, convergence_id:convergence_id})
        })
    }
})

//更新(儲存)收斂資料
router.post('/convergence/updateConvergenceData', function(req, res, next){
    //console.log(req.body);
    var groups_id_groups = req.body.groups_id_groups;
    var convergence_tag = req.body.convergence_tag;
    var convergence_content = req.body.convergence_content;
    var convergence_ref_node = req.body.convergence_ref_node;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var node_id_node = -1;

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        convergence.updateConvergenceData(groups_id_groups, convergence_tag, convergence_content, node_id_node, convergence_ref_node, member_id_member, member_name)
        .then(function(update_result){
            res.send({message:"true"})
        })
    }
})

//新增留言資料
router.post('/convergence/insertConvergenceMessage', function(req, res, next){
    var groups_id_groups = req.body.groups_id_groups;
    var message_tag = req.body.message_tag;
    var message_content = req.body.message_content;
    var convergence_id_convergence = req.body.convergence_id_convergence;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    console.log(req.body);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        convergence.insertMessage(groups_id_groups, message_tag, message_content, convergence_id_convergence, member_id_member, member_name)
        .then(function(newInsertMessage){
            console.log(newInsertMessage)
            res.send({message:"true", newInsertMessage:newInsertMessage});
        })
    }
})

//新增收斂資料節點
router.post('/convergence/insertConvergenceNode', function(req, res, next){
    var groups_id_groups = req.body.groups_id_groups;
    var tagNow = req.body.tagNow;
    var convergence_id = req.body.convergence_id;
    var convergence_ref_node = req.body.convergence_ref_node;
    var fromNodeId = convergence_ref_node.split(',');
    var convergence_content = req.body.convergence_content;
    // var node_title = "收斂結果";
    // var node_type = "convergence";
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    var node_id_node;
    console.log(req.body);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        convergence.addConvergenceNode(groups_id_groups, member_id_member, member_name, tagNow)
        .then(function(newConvergenceNode){
            var edge_to =  newConvergenceNode.insertId;
            node_id_node = newConvergenceNode.insertId;
            var edgeDataArray = [];
            if(fromNodeId.length > 0){
                for(var i = 0; i < fromNodeId.length; i++){
                    var edge_from = fromNodeId[i];
                    edgeDataArray.push({edge_from:edge_from, edge_to:edge_to, groups_id_groups:groups_id_groups});
                }
                return convergence.addEdge(edgeDataArray)
            }

        })
        .then(function(newEdge){
            return convergence.updateConvergenceData(groups_id_groups, tagNow, convergence_content, node_id_node, convergence_ref_node, member_id_member, member_name)
        })
        .then(function(updateConvergenceData){
            return convergence.updateMessageStatus(groups_id_groups, tagNow)
        })
        .then(function(newMessageStatus){
            res.send({message:"true"});
        })
    }
})


module.exports = router;