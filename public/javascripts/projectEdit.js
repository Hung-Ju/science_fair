//增加研究目的
function addPurposes(){
    var purposes = ['<div class="purposes-item margin-bottom10 form-group row">' +
                        '<label class="col-sm-2 text-center">研究目的：</label>' +
                        '<input class="col-sm-8 form-control maring-right10" type="text">&nbsp;' +
                        '<button class="delete-purposes-btn col-auto btn btn-sm btn-danger my-1 height30">刪除</button>' +
                   '</div>']
    $('#research_purposes_content').append(purposes);
    deletePurposesItem();
}

function deletePurposesItem(){
    $('.delete-purposes-btn').click(function(){
    $(this).parents('.purposes-item').remove();
});
}


//使用者輸入組別密碼後送出，
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

//
// $(function() {
//     $('.changet').click(function() {
//         var target = $(this.hash);
//         event.preventDefault(); //防止連結打開URL
//         $('html, body').animate({
//                 scrollTop: target.offset().top + -160
//             }, 500);
//     });
// });


// var member_id_student_member = <%=session("Username")%>;
$(function(){
    //利用錨點滑動葉面
    $('.changet').click(function() {
        var target = $(this.hash);
        event.preventDefault(); //防止連結打開URL
        $('html, body').animate({
                scrollTop: target.offset().top + -140
            }, 500);
    });

    //研究動機的Editor
    $('#research-motivation').summernote({
        placeholder: '是因為什麼原因或興趣讓你想研究這個題目？',
        height: 120,
        width: 600,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']]
        ]
      });

    //研究結論的Editor
    $('#conclusion').summernote({
        placeholder: '實驗或方法中所得到歸納或整理,以簡要的句子來論述(須與研究目的相呼應)。',
        height: 120,
        width: 600,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']]
        ]
    })
});

