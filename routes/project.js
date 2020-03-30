var express = require('express');
var router = express.Router();
var project = require('../models/project');

//進入組別管理頁面
router.get('/',function(req, res, next) {
    var gid = req.query.gid;
    var member_id = req.session.member_id;
    //要記得寫登入的人是否有進入該gid的權限判斷!!!

    if(!member_id){
        res.redirect('/');
    }
    else {
        var researchPurposesArray = [];
        project.selectResearchPurposes(gid, function(researchPurposes){
            if(researchPurposes){
                for (var i = 0; i < researchPurposes.length; i++){
                    var groups_id_groups = researchPurposes[i].groups_id_groups;
                    var project_data_content = researchPurposes[i].project_data_content;
                    var member_id_member = researchPurposes[i].member_id_member;
                    var member_name = researchPurposes[i].member_name;
                    var researchPurposesData = {groups_id_groups:groups_id_groups, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
                    researchPurposesArray.push(researchPurposesData);
                    //console.log(allGroupsArray);
                }
                console.log(researchPurposesArray);
                
            }
        })
        
        project.selectResearchTitleData(gid, function(researchTitle){
                if(researchTitle == ""){
                    var researchTitle = "";
                    console.log("1");
                    project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
                        if(researchMotivation == ""){      
                            var researchMotivation = "";
                            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                        }else{
                            var researchMotivation = researchMotivation[0].project_data_content;
                            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                        }
                    })
                }else{
                    console.log("2");
                    var researchTitle = researchTitle[0].project_data_content;
                    project.selectResearchMotivation([gid,researchTitle],function(researchMotivation){
                        if(researchMotivation == ""){      
                            var researchMotivation = "";
                            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                        }else{
                            var researchMotivation = researchMotivation[0].project_data_content;
                            res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                        }
                    })
                }
                // var researchTitle = researchTitle[0].project_data_content;
                // project.selectResearchMotivation(gid, function(researchMotivation){
                //     if(researchTitle == ""){
                //         var researchTitle = "";
                //         if(researchMotivation == ""){      
                //             var researchMotivation = "";
                //             res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                //         }else{
                //             var researchMotivation = researchMotivation[0].project_data_content;
                //             res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle, researchMotivation:researchMotivation});
                //         }
                //     }else{
                //         console.log(researchTitle);
                //     }
                    
                // })

                // res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle});

            // else{
            //     console.log(gid);
            //     console.log(researchTitle);
            //     res.render('projectEdit',  {title: 'Science Fair科學探究專題系統', member_id:req.session.member_id, member_name:req.session.member_name, researchTitle:researchTitle[0].project_data_content});
            // }
            
        })
    }

});

module.exports = router;