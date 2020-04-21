var express = require('express');
var router = express.Router();
var project = require('../models/project');

//進入組別實作頁面
router.get('/',function(req, res, next) {
    var gid = req.query.gid;
    //var gname = req.query.gname;
    var member_id = req.session.member_id;
    //要記得寫登入的人是否有進入該gid的權限判斷!!!

    if(!member_id){
        res.redirect('/');
    }
    else {
        var researchTitleArray = [];
        var researchMotivationArray = [];
        var researchPurposesArray = [];
        var researchExperimentArray = [];
        var researchMaterialArray = [];
        var researchRecordArray = [];
        var researchAnalysisArray = [];
        var researchDiscussionArray = [];
        var researchConclusionArray = [];

        //抓取專題實作內容資料
        project.selectResearchConclusion(gid)
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
            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitleArray, researchMotivation:researchMotivationArray, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray, researchConclusion:researchConclusionArray});
        })

        // 抓取討論的資料
        // project.selectResearchDiscussion(gid, function(researchDiscussion){
        //     if(researchDiscussion){
        //         for (var n = 0; n < researchDiscussion.length; n++){
        //             var project_data_id = researchDiscussion[n].project_data_id;
        //             var groups_id_groups = researchDiscussion[n].groups_id_groups;
        //             var project_data_content = researchDiscussion[n].project_data_content;
        //             var member_id_member = researchDiscussion[n].member_id_member;
        //             var member_name = researchDiscussion[n].member_name;
        //             var researchDiscussionData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
        //             researchDiscussionArray.push(researchDiscussionData);
        //             console.log(researchDiscussionArray);
        //         }
        //         抓取研究結果(分析及圖表)的資料
        //         project.selectResearchAnalysis(gid, function(researchAnalysis){
        //             if(researchAnalysis){
        //                 for (var m = 0; m < researchAnalysis.length; m++){
        //                     var project_data_multi_id = researchAnalysis[m].project_data_multi_id;
        //                     var groups_id_groups = researchAnalysis[m].groups_id_groups;
        //                     var project_data_multi_correspond = researchAnalysis[m].project_data_multi_correspond;
        //                     var project_data_multi_title = researchAnalysis[m].project_data_multi_title;
        //                     var project_data_multi_content = researchAnalysis[m].project_data_multi_content;
        //                     var member_id_member = researchAnalysis[m].member_id_member;
        //                     var member_name = researchAnalysis[m].member_name;
        //                     var researchAnalysisData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
        //                     researchAnalysisArray.push(researchAnalysisData);
        //                     console.log(researchAnalysisArray);
        //                 }
        //                 抓取實驗記錄的資料
        //                 project.selectResearchRecord(gid, function(researchRecord){
        //                     console.log(researchRecord);
        //                     if(researchRecord){
        //                         for (var l = 0; l < researchRecord.length; l++){
        //                             var project_data_multi_id = researchRecord[l].project_data_multi_id;
        //                             var groups_id_groups = researchRecord[l].groups_id_groups;
        //                             var project_data_multi_correspond = researchRecord[l].project_data_multi_correspond;
        //                             var project_data_multi_title = researchRecord[l].project_data_multi_title;
        //                             var project_data_multi_content = researchRecord[l].project_data_multi_content;
        //                             var member_id_member = researchRecord[l].member_id_member;
        //                             var member_name = researchRecord[l].member_name;
        //                             var researchRecordData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
        //                             researchRecordArray.push(researchRecordData);
        //                             console.log(researchRecordArray)
        //                         }
        //                         抓取研究材料及器材的資料
        //                         project.selectResearchMaterial(gid, function(researchMaterial){
        //                             console.log(researchMaterial);
        //                             if(researchMaterial){
        //                                 for (var k = 0; k< researchMaterial.length; k++){
        //                                     var material_id = researchMaterial[k].material_id;
        //                                     var groups_id_groups = researchMaterial[k].groups_id_groups;
        //                                     var material_name = researchMaterial[k].material_name;
        //                                     var material_amount = researchMaterial[k].material_amount;
        //                                     var material_img_url = researchMaterial[k].material_img_url;
        //                                     var member_id_member = researchMaterial[k].member_id_member;
        //                                     var member_name = researchMaterial[k].member_name;
        //                                     var researchMaterialData = {material_id:material_id, groups_id_groups:groups_id_groups, material_name:material_name, material_amount:material_amount, material_img_url:material_img_url, member_id_member:member_id_member, member_name:member_name};
        //                                     researchMaterialArray.push(researchMaterialData);
        //                                     console.log(researchPurposesArray);
        //                                 }
        //                                 抓取實驗項目的資料
        //                                 project.selectResearchExperiment(gid, function(researchExperiment){
        //                                     console.log(researchExperiment);
        //                                     if(researchExperiment){
        //                                         for (var j = 0; j < researchExperiment.length; j++){
        //                                             var project_data_multi_id = researchExperiment[j].project_data_multi_id;
        //                                             var groups_id_groups = researchExperiment[j].groups_id_groups;
        //                                             var project_data_multi_correspond = researchExperiment[j].project_data_multi_correspond;
        //                                             var project_data_multi_title = researchExperiment[j].project_data_multi_title;
        //                                             var project_data_multi_content = researchExperiment[j].project_data_multi_content;
        //                                             var member_id_member = researchExperiment[j].member_id_member;
        //                                             var member_name = researchExperiment[j].member_name;
        //                                             var researchExperimentData = {project_data_multi_id:project_data_multi_id, groups_id_groups:groups_id_groups, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
        //                                             researchExperimentArray.push(researchExperimentData);
        //                                             console.log(researchExperimentArray)
        //                                         }
        //                                         抓取研究目的的資料
        //                                         project.selectResearchPurposes(gid, function(researchPurposes){
        //                                             console.log(researchPurposes);
        //                                             if(researchPurposes){
        //                                                 for (var i = 0; i < researchPurposes.length; i++){
        //                                                     var project_data_id = researchPurposes[i].project_data_id;
        //                                                     var groups_id_groups = researchPurposes[i].groups_id_groups;
        //                                                     var project_data_content = researchPurposes[i].project_data_content;
        //                                                     var member_id_member = researchPurposes[i].member_id_member;
        //                                                     var member_name = researchPurposes[i].member_name;
        //                                                     var researchPurposesData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
        //                                                     researchPurposesArray.push(researchPurposesData);
        //                                                     console.log(allGroupsArray);
        //                                                 }
        //                                                 console.log(researchPurposesArray);
        //                                                 抓取研究標題的資料
        //                                                 project.selectResearchTitleData(gid, function(researchTitle){
        //                                                     if(researchTitle == ""){
        //                                                         var researchTitle = "";
        //                                                         console.log("1");
        //                                                         抓取研究動機的資料
        //                                                         project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
        //                                                             if(researchMotivation == ""){      
        //                                                                 var researchMotivation = "";
        //                                                                 res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray});
        //                                                             }else{
        //                                                                 var researchMotivation = researchMotivation[0].project_data_content;
        //                                                                 res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray});
        //                                                             }
        //                                                         }) 
        //                                                         selectResearchMotivation結束
        //                                                     }else{
        //                                                         console.log("2");
        //                                                         var researchTitle = researchTitle[0].project_data_content;
        //                                                         抓取研究動機的資料
        //                                                         project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
        //                                                             if(researchMotivation == ""){      
        //                                                                 var researchMotivation = "";
        //                                                                 res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation,researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray});
        //                                                             }else{
        //                                                                 var researchMotivation = researchMotivation[0].project_data_content;
        //                                                                 console.log(researchPurposesArray);
        //                                                                 res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray, researchMaterial:researchMaterialArray, researchRecord:researchRecordArray, researchAnalysis:researchAnalysisArray, researchDiscussion:researchDiscussionArray});
        //                                                             }
        //                                                         }) 
        //                                                         selectResearchMotivation結束
        //                                                     } 
        //                                                 }) 
        //                                                 selectResearchTitleData結束
        //                                             }
        //                                         }) 
        //                                         selectResearchPurposes結束
        //                                     }
        //                                 }) 
        //                                 selectResearchExperiment結束
        //                             }
        //                         }) 
        //                         selectResearchMaterial結束
        //                     }
        //                 }) 
        //                 selectResearchRecord結束
        //             }
        //         }) 
        //         selectResearchDiscussion結束
        //     }
        // })
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
                    }
                })
            }
        })
        // project.selectResearchTitleData(gid, function(researchTitle){
        //     project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
        //         if(researchTitle != "" && researchMotivation != ""){
        //             project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
        //                 if(result){
        //                     project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
        //                         if(result2){
        //                             res.send({message:"true"});
        //                         }
        //                     })
        //                 }
        //             })
        //         }else if(researchTitle == "" && researchMotivation != ""){
        //             project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
        //                 project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
        //                     if(result2){
        //                         res.send({message:"true"});
        //                     }
        //                 })
        //             })
        //         }else if(researchTitle != "" && researchMotivation == ""){
        //             project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result){
        //                 project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result2){
        //                     if(result2){
        //                         res.send({message:"true"});
        //                     }
        //                 })
        //             })
        //         }else{
        //             project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
        //                 project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
        //                     if(result2){
        //                         res.send({message:"true"});
        //                     }
        //                 })
        //             })
        //         }
        //     })
        // })
    }
});

//新增研究目的
router.post('/addPurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_type = "研究目的";
    var project_data_content = req.body.project_data_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    console.log(gid);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
    }
    //callback function版本
    // project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name, function(result){
    //     if(result){
    //         // console.log(result.insertId);
    //         res.send({message:"true"});
    //     }
    // });
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
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
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

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addMaterial(gid, material_name, material_amount, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
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
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
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
    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
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

    console.log(gid);

    if(!member_id_member){
        res.send({message:"false"});
    }else{
        project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name)
        .then(function(result){
            if(result){
                // console.log(result.insertId);
                res.send({message:"true"});
            }
        })
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

//刪除研究目的
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


module.exports = router;