var express = require('express');
var router = express.Router();
var project = require('../models/project');

//進入組別實作頁面
router.get('/',function(req, res, next) {
    var gid = req.query.gid;
    var member_id = req.session.member_id;
    //要記得寫登入的人是否有進入該gid的權限判斷!!!

    if(!member_id){
        res.redirect('/');
    }
    else {
        var researchPurposesArray = [];
        var researchExperimentArray = [];
        //抓取專題實作內容資料
        project.selectResearchExperiment(gid, function(researchExperiment){
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
                    console.log(researchExperimentArray)
                }
                project.selectResearchPurposes(gid, function(researchPurposes){
                    if(researchPurposes){
                        for (var i = 0; i < researchPurposes.length; i++){
                            var project_data_id = researchPurposes[i].project_data_id;
                            var groups_id_groups = researchPurposes[i].groups_id_groups;
                            var project_data_content = researchPurposes[i].project_data_content;
                            var member_id_member = researchPurposes[i].member_id_member;
                            var member_name = researchPurposes[i].member_name;
                            var researchPurposesData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
                            researchPurposesArray.push(researchPurposesData);
                            //console.log(allGroupsArray);
                        }
                        //console.log(researchPurposesArray);
                        project.selectResearchTitleData(gid, function(researchTitle){
                                        if(researchTitle == ""){
                                            var researchTitle = "";
                                            console.log("1");
                                            project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
                                                if(researchMotivation == ""){      
                                                    var researchMotivation = "";
                                                    res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray});
                                                }else{
                                                    var researchMotivation = researchMotivation[0].project_data_content;
                                                    res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray});
                                                }
                                            })
                                        }else{
                                            console.log("2");
                                            var researchTitle = researchTitle[0].project_data_content;
                                            project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
                                                if(researchMotivation == ""){      
                                                    var researchMotivation = "";
                                                    res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation,researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray});
                                                }else{
                                                    var researchMotivation = researchMotivation[0].project_data_content;
                                                    // console.log(researchPurposesArray);
                                                    res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray, researchExperiment:researchExperimentArray});
                                                }
                                            })
                                        } 
                                    })
                    }
                }) 
            }
        }) //selectResearchExperiment結束


        // project.selectResearchPurposes(gid, function(researchPurposes){
        //     if(researchPurposes){
        //         for (var i = 0; i < researchPurposes.length; i++){
        //             var project_data_id = researchPurposes[i].project_data_id;
        //             var groups_id_groups = researchPurposes[i].groups_id_groups;
        //             var project_data_content = researchPurposes[i].project_data_content;
        //             var member_id_member = researchPurposes[i].member_id_member;
        //             var member_name = researchPurposes[i].member_name;
        //             var researchPurposesData = {project_data_id:project_data_id,groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
        //             researchPurposesArray.push(researchPurposesData);
        //             //console.log(allGroupsArray);
        //         }
        //         //console.log(researchPurposesArray);
        //         project.selectResearchTitleData(gid, function(researchTitle){
        //                         if(researchTitle == ""){
        //                             var researchTitle = "";
        //                             console.log("1");
        //                             project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
        //                                 if(researchMotivation == ""){      
        //                                     var researchMotivation = "";
        //                                     res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation,researchPurposes:researchPurposesArray});
        //                                 }else{
        //                                     var researchMotivation = researchMotivation[0].project_data_content;
        //                                     res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation,researchPurposes:researchPurposesArray});
        //                                 }
        //                             })
        //                         }else{
        //                             console.log("2");
        //                             var researchTitle = researchTitle[0].project_data_content;
        //                             project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
        //                                 if(researchMotivation == ""){      
        //                                     var researchMotivation = "";
        //                                     res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation,researchPurposes:researchPurposesArray});
        //                                 }else{
        //                                     var researchMotivation = researchMotivation[0].project_data_content;
        //                                     // console.log(researchPurposesArray);
        //                                     res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', gid:gid, member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation, researchPurposes:researchPurposesArray});
        //                                 }
        //                             })
        //                         } 
        //                     })
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

    project.selectResearchTitleData(gid, function(researchTitle){
        project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
            if(researchTitle != "" && researchMotivation != ""){
                project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
                    if(result){
                        project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
                            if(result2){
                                res.send({message:"true"});
                            }
                        })
                    }
                })
            }else if(researchTitle == "" && researchMotivation != ""){
                project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
                    project.updateProjectDataContentForOne(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
                        if(result2){
                            res.send({message:"true"});
                        }
                    })
                })
            }else if(researchTitle != "" && researchMotivation == ""){
                project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result){
                    project.updateProjectDataContentForOne(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result2){
                        if(result2){
                            res.send({message:"true"});
                        }
                    })
                })
            }else{
                project.addProjectDataContent(gid, project_data_type1, project_data_content1, member_id_member, member_name, function(result){
                    project.addProjectDataContent(gid, project_data_type2, project_data_content2, member_id_member, member_name, function(result2){
                        if(result2){
                            res.send({message:"true"});
                        }
                    })
                })
            }
        })
    })
})

//新增研究目的
router.post('/addPurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_type = "研究目的";
    var project_data_content = req.body.project_data_content;
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;

    console.log(gid);
    // res.send({message:"true"});
    project.addProjectDataContent(gid, project_data_type, project_data_content, member_id_member, member_name, function(result){
        if(result){
            // console.log(result.insertId);
            res.send({message:"true"});
        }
    });
});

//修改研究目的
router.post('/editPurposes',function(req, res, next) {
    var gid = req.body.gid;
    var project_data_id = req.body.project_data_id; //該筆研究目的在資料表中的資料id
    var project_data_type = "研究目的";
    var project_data_content = req.body.project_data_content; //研究目的的內容
    var member_id_member = req.session.member_id;
    var member_name = req.session.member_name;
    project.updateProjectDataContentForMany(gid, project_data_id, project_data_type, project_data_content, member_id_member, member_name, function(result){
        if(result){
            res.send({message:"true"});
        }
    });
});

//刪除研究目的
router.post('/deletePurposes',function(req, res, next) {
    var project_data_id = req.body.project_data_id; //該筆研究目的在資料表中的資料id
    project.deleteProjectDataContentForMany(project_data_id, function(result){
        // console.log(result.affectedRows);
        // if(result){
            console.log(result);
            res.send({message:"true"});
        // }
    });
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

    //console.log(gid);
    // res.send({message:"true"});
    project.addProjectDataMultiContent(gid, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name, function(result){
        if(result){
            // console.log(result.insertId);
            res.send({message:"true"});
        }
    });
});

module.exports = router;