//summernote 網頁文字編輯器套件
function summernote(){

};

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



// var member_id_student_member = <%=session("Username")%>;
$(function(){

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