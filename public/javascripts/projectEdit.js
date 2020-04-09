//研究目的表格的初始化設定
function researchPurposesTable(){
    var researchPurposesTableData = document.getElementById("researchPurposes").value;
    var allResearchPurposes = JSON.parse(researchPurposesTableData);
    var $allResearchPurposesTable = $('#researchPurposesTable');
    
    $allResearchPurposesTable.bootstrapTable({
        columns: [
            {title: '研究目的', field: 'project_data_content'},
            {title: '', field: 'project_data_id',events: 'window.operateEvents' , formatter: 'researchPurposesButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchPurposesTable.bootstrapTable('load',allResearchPurposes);
}

window.operateEvents = {
    //研究目的表格裡的編輯按鈕
    'click .editPurposesBtn': function (e, value, row, index) {
        // console.log(row);
        //顯示視窗前呼叫
        $("#editPurposesModal").on("show.bs.modal",function(event){
            //用operateEvents把要編輯的那筆資料傳送到要開啟的編輯用modal
            document.getElementById("research_purposes_edit").value = row.project_data_content;
            //研究目的的編輯用modal裡的儲存按鈕，update研究目的用的AJAX
            $("#savePurposesModalButton").click(function(){
                var gid = document.getElementById("groups_id").value;
                console.log(row.project_data_id);
                $.ajax({  
                    type: "POST",
                    url: "/project/editPurposes",
                    data: {
                        gid: gid,
                        project_data_id: row.project_data_id,
                        project_data_content: $("#research_purposes_edit").val(),
                    },
                    success: function(data){
                        if(data){
                            // alert(123);
                            if(data.message=="true"){
                                alert('修改成功');
                                window.location.href="/project/?gid="+gid;
                            }
                            else{
                                alert('修改失敗請重新輸入');
                                window.location.href="/project/?gid="+gid;
                            }
                        }
                    },
                    error: function(){
                        alert('失敗');
                    }
                });
            })
        });
    }
}

//刪除研究目的的AJAX
function deletePurposes(project_data_id){
    var gid = document.getElementById("groups_id").value;
    $.ajax({  
        type: "POST",
        url: "/project/deletePurposes",
        data: {
            project_data_id: project_data_id
        },
        success: function(data){
            if(data){
                // alert(123);
                if(data.message=="true"){
                    alert('刪除成功');
                    window.location.href="/project/?gid="+gid;
                }
                else{
                    alert('刪除失敗請重新輸入');
                    window.location.href="/project/?gid="+gid;
                }
            }
        },
        error: function(){
            alert('失敗');
        }
    });
}

//研究目的表格裡的編輯按鈕和刪除按鈕
function researchPurposesButton(index, row){
    return ['<button class="btn btn-primary btn-sm editPurposesBtn" type="submit" data-toggle="modal" data-target="#editPurposesModal">編輯</button><br>' + 
            '<button class="btn btn-danger btn-sm stage-switch-btn deletePurposesBtn" onclick="deletePurposes('+row.project_data_id+')">刪除</button>']
}

//實驗項目表格的初始化設定
function researchExperimentTable(){
    var researchExperimentTableData = document.getElementById("researchExperiment").value;
    var allResearchExperiment = JSON.parse(researchExperimentTableData);
    var $allResearchExperimentTable = $('#researchExperimentTable');
    
    $allResearchExperimentTable.bootstrapTable({
        columns: [
            {title: '實驗項目標題', field: 'project_data_multi_title'},
            {title: '對應的實驗目的', field: 'project_data_multi_correspond'},
            {title: '實驗項目內容', field: 'project_data_multi_content'},
            {title: '', field: 'project_data_multi_id', formatter: 'researchExperimentButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchExperimentTable.bootstrapTable('load',allResearchExperiment);
}

//實驗項目表格裡的第一個欄位的實驗項目數字
// function researchExperimentIndex(value, row, index){
//     return index+1
// }

//實驗項目表格裡的編輯按鈕和刪除按鈕
function researchExperimentButton(value, row, index){
    return ['<button class="btn btn-primary btn-sm editExperimentBtn" type="submit" data-toggle="modal" data-target="#editPurposesModal">編輯</button><br>' + 
            '<button class="btn btn-danger btn-sm stage-switch-btn deleteExperimentBtn" onclick="deletePurposes('+row.project_data_multi_id+')">刪除</button>']
}

//實驗項目
function correspond_purposes_select(){
    var researchPurposesData = document.getElementById("researchPurposes").value;
    var allResearchPurposes = JSON.parse(researchPurposesData);
    $correspond_purposes = $('#correspond_purposes');
    for (var i = 0; i < allResearchPurposes.length; i++){
        var purposes = allResearchPurposes[i];
        var purposes_content = purposes.project_data_content;
        var purposes_options = ['<div class="custom-control custom-checkbox">'+
                                '<input type="checkbox" class="custom-control-input" id="'+purposes_content+'" name="purposes_select">'+
                                '<label class="custom-control-label" for="'+purposes_content+'">'+purposes_content+'</label>'+
                              '</div>'];
        $correspond_purposes.append(purposes_options);
    }
}


//增加研究目的
// function addPurposes(){
//     var purposes = ['<div class="purposes-item margin-bottom10 form-group row">' +
//                         '<label class="col-sm-2 text-center">研究目的：</label>' +
//                         '<input class="col-sm-10 form-control maring-right10" type="text" style="max-width: 75%;">&nbsp;' +
//                         '<button class="delete-purposes-btn col-auto btn btn-sm btn-danger my-1 height30">刪除</button>' +
//                    '</div>']
//     $('#research_purposes_content').append(purposes);
//     deletePurposesItem();
// }
//刪除新增的研究目的
// function deletePurposesItem(){
//     $('.delete-purposes-btn').click(function(){
//         $(this).parents('.purposes-item').remove();
//     });
// }

//增加實驗項目
function addExperiment(){
    var experiment = ['<div class="experiment-item margin-bottom10 form-group row">' +
                            '<label class="col-sm-2 text-center">實驗項目：</label>' +
                            '<div style="width:75%">' +
                                '<textarea rows="3" class="col-sm-8 form-control  create-experiment-summernote"></textarea>' +
                            '</div>&nbsp;' +
                            '<button class="delete-experiment-btn col-auto btn btn-sm btn-danger my-1 height30">刪除</button>' +
                        '</div>']
    $('#research_experiment_content').append(experiment);
    newSummer();
    deleteExperimentItem();
}
//刪除新增的實驗步驟(實驗項目)
function deleteExperimentItem(){
    $('.delete-experiment-btn').click(function(){
        $(this).parents('.experiment-item').remove();
    });
}

//增加討論項目
function addDiscussion(){
    var discussion = ['<div class="discussion-item margin-bottom10 form-group row">' +
                            '<label class="col-sm-2 text-center">討論項目：</label>' +
                            '<div style="width:75%">' +
                                '<textarea rows="4" class="col-sm-8 form-control  create-experiment-summernote"></textarea>' +
                            '</div>&nbsp;' +
                            '<button class="delete-discussion-btn col-auto btn btn-sm btn-danger my-1 height30">刪除</button>' +
                        '</div>']
    $('#research_discussion_content').append(discussion);
    newSummer();
    deleteDiscussionItem();
}

//刪除新增的討論項目
function deleteDiscussionItem(){
    $('.delete-discussion-btn').click(function(){
        $(this).parents('.discussion-item').remove();
    });
}


//使用者輸入組別密碼後送出，POST回傳true為加入成功，回傳already為重複加入
// function joinGroups(groups_id){
//     $.ajax({  
//         type: "POST",
//         url: "/groups/joinGroups",
//         data: {
//             groups_id: groups_id,
//             groups_key: $("#groupsKey"+groups_id).val(),
//         },
//         success: function(data){
//             if(data){
//                 if(data.message=="true"){
//                     alert('成功加入');
//                     window.location.href="/groups";
//                 }
//                 else if(data.message=="already"){
//                     alert('重複加入，請重新搜尋要加入的組別');
//                     window.location.href="/groups";
//                 }
//                 else{
//                     alert('加入失敗請重新嘗試');
//                     window.location.href="/groups";
//                 }
//             }
//         },
//         error: function(){
//             alert('失敗');
//         }
//     });
// };

//點選進入組別按鈕進入該組的專題編輯頁面
function enterProject(groups_id){
    //依據 id 值加在網址後面，讓編輯頁面能以 get 方式取得 key
    window.location.href = "/project/?gid="+groups_id;
}

//summernote編輯器的初始化新增
function newSummer(){
    $('.create-experiment-summernote, .create-record-summernote, .create-analysis-summernote, .create-discussion-summernote').summernote({
    disable:true,
    height: 120,
    // width: 570,
    toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']]
    ]
})};

//summernote編輯器的初始化新增
function summernoteCreate(){
    $('.create-motivation-summernote, .create-conclusion-summernote').summernote({
        height: 120,
        // width: 600,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']]
        ]
    });

    newSummer();
    $('.create-motivation-summernote').summernote('disable');
    $( ".create-experiment-summernote" ).each(function() {
        $(this).summernote('disable');
    });
    $( ".create-record-summernote" ).each(function() {
        $(this).summernote('disable');
    });
    $( ".create-analysis-summernote" ).each(function() {
        $(this).summernote('disable');
    });
    $( ".create-discussion-summernote" ).each(function() {
        $(this).summernote('disable');
    });
    $('.create-conclusion-summernote').summernote('disable');

}


//階段切換彈出modal欄位內容
// function changeStageInput(){
//     var inputAdd = document.getElementById('groupsRoot');  
//     var html = ['<p>'];
//     groupsInputData.map(function(data){
//         if (data.useFor=="all"){
//             var html = ['<p>'+ data.title + '：' +'<input class="form-control" type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required="required"></p>'];
//             $(inputAdd).append(html);
//         }
//         else {
//         }
//     })  
// };


$(function(){
    researchPurposesTable();
    researchExperimentTable();
    correspond_purposes_select();
    //切換階段顯示
    $('#selectStage').change(function () {
        //只開啟研究動機和研究目的的編輯區塊
        if ($("#selectStage").val() == "形成問題"){
            $('#writing_content *').attr('disabled', true);   
            $('#research_motivation *, #research_purposes *').removeAttr('disabled');

            summernoteCreate();
            $(".create-motivation-summernote").summernote("enable"); 
            $('#L1').addClass("active");
            $('#L2, #L3, #L4, #L5').removeClass("active") ;
        //只開啟實驗步驟和研究設備及器材的編輯區塊
        } else if ($("#selectStage").val() == "研究規劃"){
            $('#writing_content *').attr('disabled', true);
            $('#experimental_project *, #research_material *').removeAttr('disabled');

            summernoteCreate();
            $( ".create-experiment-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $('#L2').addClass("active");
            $('#L1, #L3, #L4, #L5').removeClass("active") ;
            //table列拖拉和數字排序
            // $( "table tbody" ).sortable( {
            //     update: function( event, ui ) {
            //         $(this).children().each(function(index) {
            //                 $(this).find('td').first().html(index + 1)
            //         });
            //     }   
            // });

        //只開啟實驗記錄和研究結果(分析及圖表)的編輯區塊
        } else if ($("#selectStage").val() == "執行"){
            $('#writing_content *').attr('disabled', true);
            $('#research_record *, #research_analysis *').removeAttr('disabled');

            summernoteCreate();
            $( ".create-record-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $( ".create-analysis-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $('#L3').addClass("active");
            $('#L1, #L2, #L4, #L5').removeClass("active") ;
        //只開啟討論和結論的編輯區塊
        } else if ($("#selectStage").val() == "分析與詮釋"){
            $('#writing_content *').attr('disabled', true);
            $('#research_discussion *, #research_conclusion *').removeAttr('disabled');

            summernoteCreate();
            $( ".create-discussion-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $(".create-conclusion-summernote").summernote("enable");
            $('#L4').addClass("active");
            $('#L1, #L2, #L3, #L5').removeClass("active") ;
        //全部編輯區塊開啟
        }  else if ($("#selectStage").val() == "統整報告"){
            $('#writing_content *').attr('disabled', false);

            summernoteCreate();
            $(".create-motivation-summernote").summernote("enable");
            $( ".create-experiment-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $( ".create-record-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $( ".create-analysis-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $( ".create-discussion-summernote" ).each(function() {
                $(this).summernote('enable');
            });
            $(".create-conclusion-summernote").summernote("enable");
            $('#L5').addClass("active");
            $('#L1, #L2, #L3, #L4').removeClass("active") ;
        } 
        
        
    }).change();

    //用ajax的方式新增研究目的
    $("#addPurposesModalButton").click(function () {
        var gid = document.getElementById("groups_id").value;
        // console.log(gid);
        
        $.ajax({  
            type: "POST",
            url: "/project/addPurposes",
            data: {
                gid: gid,
                project_data_content: $("#research_purposes_add").val()
            },
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('新增失敗請重新輸入');
                        window.location.href="/groups";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });

    //用ajax的方式儲存和修改研究題目跟研究動機
    $("#saveResearchMotivation").click(function () {
        var gid = document.getElementById("groups_id").value;
        var project_data_content2 = $(".create-motivation-summernote").val();
        // console.log(gid);
        
        $.ajax({  
            type: "POST",
            url: "/project/updateResearchTitle",
            data: {
                gid: gid,
                project_data_content1: $("#research_title").val(),
                project_data_content2: project_data_content2
            },
            success: function(data){
                if(data){
                    //  alert(project_data_content2);
                    if(data.message=="true"){
                        alert('成功');
                        window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('失敗，請重新輸入');
                        window.location.href="/groups";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });



    //table列拖拉和數字排序
    // $( "table tbody" ).sortable( {
    //     update: function( event, ui ) {
    //     $(this).children().each(function(index) {
    //             $(this).find('td').first().html(index + 1)
    //     });
    //   }
    // });

    //利用錨點滑動頁面
    $('.changet').click(function() {
        var target = $(this.hash);
        event.preventDefault(); //防止連結打開URL
        $('html, body').animate({
                scrollTop: target.offset().top + -140
            }, 500);
    });



});

