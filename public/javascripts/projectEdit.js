//研究目的表格的初始化設定
function researchPurposesTable(){
    var JoinGroups = document.getElementById("memberJoinGroups").value;
    // console.log(JoinGroups);
    var memberJoinGroups = JSON.parse(JoinGroups);
    var $groupsTable = $('#joinGroups');
    $groupsTable.bootstrapTable({
        columns: [
            {title: '已經加入組別名稱', field: 'groups_name'},
            {title: '創立時間', field: 'groups_createtime', width: 300},
            {title: '進入組別', field: 'groups_id', formatter: 'enterProjectButton', width: 200}
            ],
        theadClasses: 'thead-light table-sm',
        classes: 'table table-bordered table-light',
        pagination: true
    });
    $groupsTable.bootstrapTable('load',memberJoinGroups);
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
function joinGroups(groups_id){
    $.ajax({  
        type: "POST",
        url: "/groups/joinGroups",
        data: {
            groups_id: groups_id,
            groups_key: $("#groupsKey"+groups_id).val(),
        },
        success: function(data){
            if(data){
                if(data.message=="true"){
                    alert('成功加入');
                    window.location.href="/groups";
                }
                else if(data.message=="already"){
                    alert('重複加入，請重新搜尋要加入的組別');
                    window.location.href="/groups";
                }
                else{
                    alert('加入失敗請重新嘗試');
                    window.location.href="/groups";
                }
            }
        },
        error: function(){
            alert('失敗');
        }
    });
};

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
            $( "table tbody" ).sortable( {
                update: function( event, ui ) {
                    $(this).children().each(function(index) {
                            $(this).find('td').first().html(index + 1)
                    });
                }   
            });

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

    //研究動機的Editor
    // $('#research-motivation').summernote({
    //     placeholder: '是因為什麼原因或興趣讓你想研究這個題目？',
    //     height: 120,
    //     width: 600,
    //     toolbar: [
    //         ['style', ['style']],
    //         ['font', ['bold', 'underline', 'clear']],
    //         ['color', ['color']],
    //         ['para', ['ul', 'ol', 'paragraph']],
    //         ['table', ['table']],
    //         ['insert', ['link', 'picture', 'video']]
    //     ]
    //   });

    //研究結論的Editor
    // $('#conclusion-summernote').summernote({
    //     placeholder: '實驗或方法中所得到歸納或整理,以簡要的句子來論述(須與研究目的相呼應)。',
    //     height: 120,
    //     width: 600,
    //     toolbar: [
    //         ['style', ['style']],
    //         ['font', ['bold', 'underline', 'clear']],
    //         ['color', ['color']],
    //         ['para', ['ul', 'ol', 'paragraph']],
    //         ['table', ['table']],
    //         ['insert', ['link', 'picture', 'video']]
    //     ]
    // })
});

