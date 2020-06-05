//資料填寫欄位Data
var groupsInputData = [{title: "組別名稱", type:"text", name:"groups_name", useFor: "all"},
                    {title: "組別密碼", type:"text", name:"groups_key", useFor: "all"},
                    //{title: "指導老師", type:"text", name:"groups_teacher", useFor: "all"},
                    {title: "組別簡介", type:"textarea", name:"groups_introduction", useFor: "all"},
                    ];

//增加新增小組資料填寫欄位
function addGroupInput(){
    var inputAdd = document.getElementById('groupsRoot');  
    groupsInputData.map(function(data){
        if (data.useFor=="all" && data.type=="text"){
            var html = ['<p>'+ data.title + '：' +'<input class="form-control" type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required maxlength="20"></p>'];
            $(inputAdd).append(html);
        }
        else if(data.useFor=="all" && data.type=="textarea"){
            var html = ['<p>'+ data.title + '：' +'<br><textarea  class="form-control" name="'+data.name+'"id="'+data.name+'" maxlength="50" style="width=100%"></textarea>'];
            $(inputAdd).append(html);
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
    var mode = "內容撰寫";
    var mode2 = "實作";
    $.ajax({
        url: "/project/addLoginCount",
        type: "POST",
        async: false,
        //取消同步，等ajax結束後再進行後面的動作
        data: {
            groups_id:groups_id
        },
        success: function(results){
            console.log("增加登入次數成功");
            window.location.href = "/project/"+groups_id+"/"+mode+"/"+mode2;
        },
        false: function(){
            alert('帳號已被系統自動登出，請重新登入');
        }
    });
    
}

//用bootstrap-table創已加入組別table
function joinGroupsTable(){
    var JoinGroups = document.getElementById("memberJoinGroups").value;
    // console.log(JoinGroups);
    var memberJoinGroups = JSON.parse(JoinGroups);
    var $groupsTable = $('#joinGroups');
    $groupsTable.bootstrapTable({
        columns: [
            {title: '已經加入組別名稱', field: 'groups_name'},
            {title: '組別簡介', field: 'groups_introduction'},
            {title: '創立時間', field: 'groups_createtime', width: 200},
            {title: '', field: 'groups_id', formatter: 'enterProjectButton', width: 150}
            ],
        theadClasses: 'thead-light table-sm',
        classes: 'table table-bordered table-light',
        pagination: true,
        locale: "zh-TW"
    });
    $groupsTable.bootstrapTable('load',memberJoinGroups);
}

function enterProjectButton(value, row){
    return ['<button class="btn btn-primary btn-sm" onclick="enterProject('+value+')">進入組別</button>']
}

//用bootstrap-table創全部組別table
function allGroupsTable(){
    var allGroups = document.getElementById("allGroups").value;
    // console.log(JoinGroups);
    var memberAllGroups = JSON.parse(allGroups);
    var $allGroupsTable = $('#allGroupsTable');
    $allGroupsTable.bootstrapTable({
        columns: [
            {title: '未加入組別名稱', field: 'groups_name'},
            {title: '組別簡介', field: 'groups_introduction'},
            {title: '創立時間', field: 'groups_createtime', width:200},
            {title: '', field: 'groups_id', formatter: 'joinProjectButton', width:150}
            ],
        theadClasses: 'thead-light table-sm',
        classes: 'table table-bordered table-light',
        pagination: true,
        detailView: true,
        detailViewIcon: false,
        detailFormatter: 'groupsDetailFormatter'
    });
    $allGroupsTable.bootstrapTable('load',memberAllGroups);
}

function joinProjectButton(index, row){
    //console.log(index);
    return ['<button id="expandRowId'+row.groups_id+'" class="btn btn-primary btn-sm" onclick="joinProject('+row.groups_index+','+row.groups_id+')">申請加入</button>']
}

//在這裡加進onclick的jquery去改變function
function joinProject(index, groups_id){
     console.log(index);
    //console.log(groups_id);
    var $allGroupsTable = $('#allGroupsTable');
    $allGroupsTable.bootstrapTable('expandRow',index);
    $('#expandRowId'+groups_id).attr("onclick","collapseJoinProject("+index+","+groups_id+")");
    // $this.attr("onclick","collapseJoinProject(row.groups_index,row.groups_id)")
}

function collapseJoinProject(index, groups_id){
    var $allGroupsTable = $('#allGroupsTable');
    $allGroupsTable.bootstrapTable('collapseRow',index);
    $('#expandRowId'+groups_id).attr("onclick","joinProject("+index+","+groups_id+")");
}

function groupsDetailFormatter(index, row) {
    return ['請輸入社群密碼：<input type="text" name="groups'+row.groups_id+'" id="groupsKey'+row.groups_id+'" >'+
            '<button class="btn btn-success btn-sm" onclick="joinGroups('+row.groups_id+');">送出</button>']
    // var html = []
    // $.each(row, function (key, value) {
    //   html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    // })
    // return html.join('')
}


// var member_id_student_member = <%=session("Username")%>;
$(function(){
    addGroupInput();
    joinGroupsTable();
    allGroupsTable()
    //將註冊資料透過ajax傳送執行

    $("#addGroups").click(function () {
        if($("#groups_name").val()=="" || $("#groups_key").val()==""){
            alert('請填入完整資料');
        }else{
            $.ajax({  
                type: "POST",
                url: "/groups/add",
                data: {
                    groups_name: $("#groups_name").val(),
                    groups_key: $("#groups_key").val(),
                    groups_introduction: $("#groups_introduction").val()
                },
                success: function(data){
                    if(data){
                        if(data.message=="true"){
                            alert('小組新增成功');
                            window.location.href="/groups";
                        }else if(data.message=="nullContent"){
                            alert('請確實填入組別資料')
                        }else if(data.message=="false"){
                            alert('帳號已被系統自動登出，請重新登入');
                            window.location.href="/";
                        }else{
                            alert('新增失敗請重新輸入');
                            window.location.href="/groups/groupsFile";
                        }
                    }
                },
                error: function(){
                    alert('失敗');
                }
            });
        }

        
    });
});