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
            gid:gid,
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
                    alert('帳號已被系統自動登出，請重新登入');
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
            {title: '對應的研究目的', field: 'project_data_multi_correspond'},
            {title: '實驗項目內容(說明與步驟)', field: 'project_data_multi_content'},
            {title: '', field: 'project_data_multi_id', events: 'window.operateEvents2', formatter: 'researchExperimentButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchExperimentTable.bootstrapTable('load',allResearchExperiment);
}

//實驗項目表格裡的編輯按鈕和刪除按鈕
function researchExperimentButton(value, row, index){
    return ['<button class="btn btn-primary btn-sm editExperimentBtn" type="submit" data-toggle="modal" data-target="#editExperimentModal">編輯</button><br>' + 
            '<button class="btn btn-danger btn-sm stage-switch-btn deleteExperimentBtn" onclick="deleteExperiment('+row.project_data_multi_id+')">刪除</button>']
}

//實驗項目新增用modal裡選擇對應的研究目的用的checkbox
function correspond_purposes_select(){
    var researchPurposesData = document.getElementById("researchPurposes").value;
    var allResearchPurposes = JSON.parse(researchPurposesData);
    $correspond_purposes = $('.correspond_purposes');
    $correspond_purposes.html("");
    for (var i = 0; i < allResearchPurposes.length; i++){
        var purposes = allResearchPurposes[i];
        var purposes_content = purposes.project_data_content;
        var purposes_options = ['<div class="custom-control custom-checkbox">'+
                                '<input type="checkbox" class="custom-control-input" id="'+purposes_content+'" name="purposes_select" value="'+purposes_content+'">'+
                                '<label class="custom-control-label" for="'+purposes_content+'">'+purposes_content+'</label>'+
                              '</div>'];
        $correspond_purposes.append(purposes_options);
    }
}
//實驗項目編輯用modal裡選擇對應的研究目的用的checkbox
function correspond_purposes_select2(){
    var researchPurposesData = document.getElementById("researchPurposes").value;
    var allResearchPurposes = JSON.parse(researchPurposesData);
    $correspond_purposes = $('.correspond_purposes2');
    $correspond_purposes.html("");
    for (var i = 0; i < allResearchPurposes.length; i++){
        var purposes = allResearchPurposes[i];
        var purposes_content = purposes.project_data_content;
        var purposes_options = ['<div class="custom-control custom-checkbox">'+
                                '<input type="checkbox" class="custom-control-input" id="'+purposes_content+'2'+'" name="purposes_select2" value="'+purposes_content+'">'+
                                '<label class="custom-control-label" for="'+purposes_content+'2'+'">'+purposes_content+'</label>'+
                              '</div>'];
        $correspond_purposes.append(purposes_options);
    }
}

window.operateEvents2 = {
    //實驗項目表格裡的編輯按鈕
    'click .editExperimentBtn': function (e, value, row, index) {
        var correspond_data = row.project_data_multi_correspond
        // var project_data_multi_correspond;
        // project_data_multi_correspond = correspond_data.split(',');

        // // correspond_purposes_select();
        console.log(row.project_data_multi_id);
        //顯示視窗前呼叫
        $("#editExperimentModal").on("show.bs.modal",function(event){
            //用operateEvents2把要編輯的那筆資料傳送到要開啟的編輯用modal
            document.getElementById("research_experiment_title_edit").value = row.project_data_multi_title;
            $("#research_experiment_content_edit").summernote('code',row.project_data_multi_content);

            //研究目的的編輯用modal裡的儲存按鈕，update研究目的用的AJAX
            $("#saveExperimentModalButton").click(function(){
                var gid = document.getElementById("groups_id").value;
                var cbxPurposesSelect = [];
                $('input[name="purposes_select2"]:checked').each(function() { 
                    cbxPurposesSelect.push($(this).val());
                });
                // console.log(row.project_data_id);
                $.ajax({  
                    type: "POST",
                    url: "/project/editExperiment",
                    data: {
                        gid: gid,
                        project_data_multi_id: row.project_data_multi_id,
                        project_data_multi_correspond: cbxPurposesSelect.toString(),
                        project_data_multi_title: $("#research_experiment_title_edit").val(),
                        project_data_multi_content: $("#research_experiment_content_edit").val(),
                    },
                    success: function(data){
                        if(data){
                            // alert(123);
                            if(data.message=="true"){
                                alert('修改成功');
                                window.location.href="/project/?gid="+gid;
                            }
                            else{
                                alert('帳號已被系統自動登出，請重新登入');
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

//刪除實驗項目的AJAX
function deleteExperiment(project_data_multi_id){
    var gid = document.getElementById("groups_id").value;
    $.ajax({  
        type: "POST",
        url: "/project/deleteExperiment",
        data: {
            gid:gid,
            project_data_multi_id: project_data_multi_id
        },
        success: function(data){
            if(data){
                // alert(123);
                if(data.message=="true"){
                    alert('刪除成功');
                    window.location.href="/project/?gid="+gid;
                }
                else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/project/?gid="+gid;
                }
            }
        },
        error: function(){
            alert('失敗');
        }
    });
}

//研究設備及器材表格的初始化設定
function researchMaterialTable(){
    var researchMaterialTableData = document.getElementById("researchMaterial").value;
    var allResearchMaterial = JSON.parse(researchMaterialTableData);
    var $allResearchMaterialTable = $('#researchMaterialTable');
    
    $allResearchMaterialTable.bootstrapTable({
        columns: [
            {title: '實驗材料名稱', field: 'material_name'},
            {title: '實驗材料數量(單位)', field: 'material_amount'},
            // {title: '補充說明', field: ''},
            {title: '', field: 'material_id', events: 'window.operateEventsMaterial', formatter: 'researchMaterialButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchMaterialTable.bootstrapTable('load',allResearchMaterial);
}

//研究設備及器材表格裡的編輯按鈕和刪除按鈕
function researchMaterialButton(value, row, index){
    return ['<button class="btn btn-primary btn-sm editMaterialBtn" type="submit" data-toggle="modal" data-target="#editMaterialModal">編輯</button><br>' + 
            '<button class="btn btn-danger btn-sm stage-switch-btn deleteMaterialBtn" onclick="deleteMaterial('+row.material_id+')">刪除</button>']
}

window.operateEventsMaterial = {
    //研究設備及器材表格裡的編輯按鈕
    'click .editMaterialBtn': function (e, value, row, index) {
        //顯示視窗前呼叫
        $("#editMaterialModal").on("show.bs.modal",function(event){
            //用operateEventsMaterial把要編輯的那筆資料傳送到要開啟的編輯用modal
            document.getElementById("research_material_name_edit").value = row.material_name;
            document.getElementById("research_material_amount_edit").value = row.material_amount;

            //研究設備及器材的編輯用modal裡的儲存按鈕，update研究設備及器材用的AJAX
            $("#editMaterialModalButton").click(function(){
                var gid = document.getElementById("groups_id").value;
                // console.log(row.project_data_id);
                $.ajax({  
                    type: "POST",
                    url: "/project/editMaterial",
                    data: {
                        gid: gid,
                        material_id: row.material_id,
                        material_name: $("#research_material_name_edit").val(),
                        material_amount: $("#research_material_amount_edit").val(),
                    },
                    success: function(data){
                        if(data){
                            // alert(123);
                            if(data.message=="true"){
                                alert('修改成功');
                                window.location.href="/project/?gid="+gid;
                            }
                            else{
                                alert('帳號已被系統自動登出，請重新登入');
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

//刪除研究設備及器材的AJAX
function deleteMaterial(material_id){
    var gid = document.getElementById("groups_id").value;
    $.ajax({  
        type: "POST",
        url: "/project/deleteMaterial",
        data: {
            material_id: material_id
        },
        success: function(data){
            if(data){
                // alert(123);
                if(data.message=="true"){
                    alert('刪除成功');
                    window.location.href="/project/?gid="+gid;
                }
                else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/project/?gid="+gid;
                }
            }
        },
        error: function(){
            alert('失敗');
        }
    });
}

//實驗記錄表格的初始化設定
function researchRecordTable(){
    var researchRecordTableData = document.getElementById("researchRecord").value;
    var allResearchRecord = JSON.parse(researchRecordTableData);
    var $allResearchRecordTable = $('#researchRecordTable');
    
    $allResearchRecordTable.bootstrapTable({
        columns: [
            {title: '對應的實驗項目', field: 'project_data_multi_correspond'},
            {title: '實驗記錄內容', field: 'project_data_multi_content'},
            {title: '', field: 'project_data_multi_id', events: 'window.operateEventsRecord', formatter: 'researchRecordButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchRecordTable.bootstrapTable('load',allResearchRecord);
}

//研究設備及器材表格裡的編輯按鈕和刪除按鈕
function researchRecordButton(value, row, index){
    return ['<button class="btn btn-primary btn-sm editRecordBtn" type="submit" data-toggle="modal" data-target="#editRecordModal">編輯</button><br>' + 
            '<button class="btn btn-danger btn-sm stage-switch-btn deleteMaterialBtn" onclick="deleteMaterial('+row.material_id+')">刪除</button>']
}

//實驗項目新增用modal裡選擇對應的研究目的用的radio
function correspond_record_select(){
    var researchExperimentData = document.getElementById("researchExperiment").value;
    var allResearchExperiment = JSON.parse(researchExperimentData);
    $correspond_experiment = $('.correspond_experiment');
    $correspond_experiment.html("");
    for (var i = 0; i < allResearchExperiment.length; i++){
        var experiment = allResearchExperiment[i];
        var experiment_title = experiment.project_data_multi_title;
        var experiment_options = ['<div class="custom-control custom-radio">'+
                                '<input type="radio" class="custom-control-input" id="'+experiment_title+'" name="experiment_select" value="'+experiment_title+'">'+
                                '<label class="custom-control-label" for="'+experiment_title+'">'+experiment_title+'</label>'+
                              '</div>'];
        $correspond_experiment.append(experiment_options);
    }
}

//實驗項目編輯用modal裡選擇對應的研究目的用的radio
function correspond_record_select2(){
    var researchExperimentData = document.getElementById("researchExperiment").value;
    var allResearchExperiment = JSON.parse(researchExperimentData);
    $correspond_experiment = $('.correspond_experiment2');
    $correspond_experiment.html("");
    for (var i = 0; i < allResearchExperiment.length; i++){
        var experiment = allResearchExperiment[i];
        var experiment_title = experiment.project_data_multi_title;
        var experiment_options = ['<div class="custom-control custom-radio">'+
                                '<input type="radio" class="custom-control-input" id="'+experiment_title+'2'+'" name="experiment_select2" value="'+experiment_title+'2'+'">'+
                                '<label class="custom-control-label" for="'+experiment_title+'2'+'">'+experiment_title+'2'+'</label>'+
                              '</div>'];
        $correspond_experiment.append(experiment_options);
    }
}

window.operateEventsRecord = {
    //研究設備及器材表格裡的編輯按鈕
    'click .editRecordBtn': function (e, value, row, index) {
        //顯示視窗前呼叫
        $("#editRecordModal").on("show.bs.modal",function(event){
            //用operateEventsMaterial把要編輯的那筆資料傳送到要開啟的編輯用modal
            // document.getElementById("research_material_name_edit").value = row.material_name;
            $("#research_record_content_edit").summernote('code',row.project_data_multi_content);

            //研究設備及器材的編輯用modal裡的儲存按鈕，update研究設備及器材用的AJAX
            $("#editRecordModalButton").click(function(){
                var gid = document.getElementById("groups_id").value;
                var cbxExperimentSelect = [];
                $('input[name="experiment_select2"]:checked').each(function() { 
                    cbxExperimentSelect.push($(this).val());
                });
                $.ajax({  
                    type: "POST",
                    url: "/project/editRecord",
                    data: {
                        gid: gid,
                        project_data_multi_id: row.project_data_multi_id,
                        project_data_multi_correspond: cbxExperimentSelect.toString(),
                        material_amount: $("#research_material_amount_edit").val(),
                    },
                    success: function(data){
                        if(data){
                            // alert(123);
                            if(data.message=="true"){
                                alert('修改成功');
                                window.location.href="/project/?gid="+gid;
                            }
                            else{
                                alert('帳號已被系統自動登出，請重新登入');
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

//研究結果(分析及圖表)表格的初始化設定
function researchAnalysisTable(){
    var researchAnalysisTableData = document.getElementById("researchAnalysis").value;
    var allResearchAnalysis = JSON.parse(researchAnalysisTableData);
    var $allResearchAnalysisTable = $('#researchAnalysisTable');
    
    $allResearchAnalysisTable.bootstrapTable({
        columns: [
            {title: '對應的研究目的', field: 'project_data_multi_correspond'},
            {title: '分析項目內容', field: 'project_data_multi_content'},
            {title: '', field: 'project_data_multi_id', formatter: 'researchExperimentButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allResearchAnalysisTable.bootstrapTable('load',allResearchAnalysis);
}

//討論表格的初始化設定
function researchDiscussionTable(){
    var researchDiscussionTableData = document.getElementById("researchDiscussion").value;
    var allResearchDiscussion = JSON.parse(researchDiscussionTableData);
    var $allresearchDiscussionTable = $('#researchDiscussionTable');
    
    $allresearchDiscussionTable.bootstrapTable({
        columns: [
            {title: '討論內容', field: 'project_data_content'},
            {title: '', field: 'project_data_id',events: 'window.operateEvents' , formatter: 'researchPurposesButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered bg-light',
        pagination: true
    });
    $allresearchDiscussionTable.bootstrapTable('load',allResearchDiscussion);
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
    researchMaterialTable();
    researchRecordTable();
    researchAnalysisTable();
    researchDiscussionTable();
    correspond_purposes_select();
    correspond_purposes_select2();
    correspond_record_select();
    correspond_record_select2();
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

    //用ajax的方式新增實驗記錄
    $("#addRecordModalButton").click(function () {
        var gid = document.getElementById("groups_id").value;
        // console.log(gid);
        var cbxExperimentSelect = [];
        $('input[name="experiment_select"]:checked').each(function() { 
            cbxExperimentSelect.push($(this).val());
        });
              
        $.ajax({  
            type: "POST",
            url: "/project/addRecord",
            data: {
                gid: gid,
                project_data_multi_correspond: cbxExperimentSelect.toString(),
                project_data_multi_content: $(".create-record-summernote").val(),
            },
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });

    //用ajax的方式新增研究設備及器材
    $("#addMaterialModalButton").click(function () {
        var gid = document.getElementById("groups_id").value;

        $.ajax({  
            type: "POST",
            url: "/project/addMaterial",
            data: {
                gid: gid,
                material_name: $("#research_material_name").val(),
                material_amount: $("#research_material_amount").val(),
            },
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });

    //用ajax的方式新增實驗項目
    $("#addExperimentModalButton").click(function () {
        var gid = document.getElementById("groups_id").value;
        // console.log(gid);
        var cbxPurposesSelect = [];
        $('input[name="purposes_select"]:checked').each(function() { 
            cbxPurposesSelect.push($(this).val());
        });
              
        $.ajax({  
            type: "POST",
            url: "/project/addExperiment",
            data: {
                gid: gid,
                project_data_multi_title: $("#research_experiment_title_add").val(),
                project_data_multi_correspond: cbxPurposesSelect.toString(),
                project_data_multi_content: $(".create-experiment-summernote").val(),
            },
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });

    //用ajax的方式新增研究目的
    $("#addPurposesModalButton").click(function () {
        var gid = document.getElementById("groups_id").value;

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
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
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
                        alert('儲存成功');
                        $('.create-motivation-summernote').removeClass("editing");
                        // window.location.href="/project/?gid="+gid;
                    }
                    else{
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });


    //利用錨點滑動頁面
    $('.changet').click(function() {
        var target = $(this.hash);
        event.preventDefault(); //防止連結打開URL
        $('html, body').animate({
                scrollTop: target.offset().top + -140
            }, 500);
    });

    //偵測如果有改變但是尚未儲存進資料庫就會跳出系統提醒
    $(".create-motivation-summernote").on("summernote.change", function (e) {   // callback as jquery custom event 
        $(this).addClass("editing");
    });

    $(window).bind('beforeunload', function (e) {
        if ($(".editing").get().length > 0) {
            return '資料尚未存檔，確定是否要離開？';
        }
    })


});

