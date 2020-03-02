//資料填寫欄位Data
var groupsInputData = [{title: "組別名稱", type:"text", name:"groups_name", useFor: "all"},
                    {title: "組別密碼", type:"text", name:"groups_key", useFor: "all"},
                    {title: "指導老師", type:"text", name:"groups_teacher", useFor: "leader"},
                    ];

//增加新增小組資料填寫欄位
function addGroupInput(){
    var inputAdd = document.getElementById('groupsRoot');  
    groupsInputData.map(function(data){
        if (data.useFor=="all"){
            var html = ['<p>'+ data.title + '：' +'<input class="form-control" type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required="required"></p>'];
            $(inputAdd).append(html);
        }
        else {

        }
    })  
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
    addGroupInput();

    //將註冊資料透過ajax傳送執行
    $("#addGroups").click(function () {

        $.ajax({  
            type: "POST",
            url: "/groups/add",
            data: {
                groups_name: $("#groups_name").val(),
                groups_key: $("#groups_key").val(),
            },
            success: function(data){
                if(data){
                    if(data.message=="true"){
                        alert('小組新增成功');
                        window.location.href="/groups";
                    }
                    else{
                        alert('新增失敗請重新輸入');
                        window.location.href="/groups/groupsFile";
                    }
                }
            },
            error: function(){
                alert('失敗');
            }
        });
    });

    //將小組加入申請透過ajax傳送執行
    // $("#joinGroups").click(function () {

    //     $.ajax({  
    //         type: "POST",
    //         url: "/groups/joinGroups",
    //         data: {
    //             groups_id: $("#groups_name").val(),
    //             groups_key: $("#groups_key").val(),
    //         },
    //         success: function(data){
    //             if(data){
    //                 if(data.message=="true"){
    //                     alert('小組新增成功');
    //                     window.location.href="/groups";
    //                 }
    //                 else{
    //                     alert('新增失敗請重新輸入');
    //                     window.location.href="/groups/groupsFile";
    //                 }
    //             }
    //         },
    //         error: function(){
    //             alert('失敗');
    //         }
    //     });
    // });


});