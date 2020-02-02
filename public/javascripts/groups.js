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
            var html = ['<p>'+ data.title +'<input type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required="required"></p>'];
            $(inputAdd).append(html);
        }
        else {

        }
    })  
};

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

});