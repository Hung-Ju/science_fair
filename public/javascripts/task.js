var socket = io();

//組別成員資料選擇設定
function memberSelect(){
  var groupsMemberData = JSON.parse($('#groupsMemberData').val());
  console.log(groupsMemberData);
  groupsMemberData.forEach(function(value){
    var member_id_member = value.member_id_member;
    var member_name = value.member_name;
    var options = '<option data-memberid="'+member_id_member+'" value="'+member_name+'">'+member_name+'</option>';
    $('.task_member_name').append(options);
    $('.task_member_name2').append(options);
  })
  var options2='<option data-memberid="'+0+'" value="所有人">所有人</option>';
  $('.task_member_name').append(options2);
    $('.task_member_name2').append(options2);

}

//任務方塊的顯示
function showTaskBox(groupsTaskData){
  // var groupsTaskData = JSON.parse($('#groupsTaskData').val());
  groupsTaskData.forEach(function(value){
    var task_id = value.task_id;
    var task_content = value.task_content;
    var task_member_id = value.task_member_id;
    var task_member_name = value.task_member_name;
    var task_createtime = value.task_createtime;
    var task_status = value.task_status;

    // console.log(task_member_name);

    var taskBox = '<div class="card task-card tid'+task_id+'" id="tid'+task_id+'"  style="margin-bottom: 15px;">'+
                  '<div class="card-body">'+task_content+'</div>'+
                  '<div class="card-footer text-right" data-taskidnow="'+task_id+'" data-oldtaskcontent="'+task_content+'" data-oldtaskstatus="'+task_status+'" style="padding: 0.3rem 1.25rem;">'+
                  task_member_name+'  '+task_createtime+' <i class="fas fa-pencil-alt mr-1 editTaskIcon" style="color: rgb(4, 4, 194);" data-toggle="modal" data-target="#editTask"></i><i class="far fa-trash-alt deleteTaskIcon" style="color: rgb(207, 0, 0);" aria-hidden="true" data-toggle="modal" data-target="#checkRemoveTask"></i>'+
                  '</div></div>';

    if(task_status == "backlog"){
      $('.backlog').append(taskBox);
    }else if(task_status == "todo"){
      $('.todo').append(taskBox);
    }else if(task_status == "doing"){
      $('.doing').append(taskBox);
    }else if(task_status == "done"){
      $('.done').append(taskBox);
    }
    

  })

  addListeners();
  clickEvents();

}

//任務方塊拖拉設定
function addListeners() {
    $(".task-card").draggable({
      revert: "invalid",
      start: function() {
        $(this).addClass("selected");
      },
      stop: function() {
        $(this).removeClass("selected");
        
        console.log($(this).parent(".tasks").data("status"))
        console.log($(this).find('.card-footer').data('taskidnow'))
        var gid = document.getElementById("gid").value;

        $.ajax({  
          type: "POST",
          url: "/task/editTaskStatus",
          data: {
              task_id: $(this).find('.card-footer').data('taskidnow'),
              task_status: $(this).parent(".tasks").data("status")
          },
          success: function(data){
              if(data){
                  // alert(123);
                  if(data.message=="true"){
                      // alert('修改狀態成功');
                      socket.emit('update task status', {gid:gid, task_id: $(this).find('.card-footer').data('taskidnow'), taskData:data.taskData})
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

        $(this).remove();
      }
    });
  
    $(".column").droppable({
      accept: ".task-card",
      drop: function(event, ui) {
        ui.draggable
          .css("left", "0")
          .css("top", "0")
          .appendTo($(this).find(".tasks"))
      }
    });
  }

function clickEvents() {
  //點選編輯任務Icon
  $('.editTaskIcon').click(function(){
    $taskCardFooter = $(this).parent('.card-footer');
    var task_id_now = $taskCardFooter.data('taskidnow');
    var task_content = $taskCardFooter.data('oldtaskcontent');
    var task_status_now = $taskCardFooter.data('oldtaskstatus');
    // console.log(task_content);
    
    //打開任務編輯modal
    $("#editTask").on("show.bs.modal",function(event){
      var task_id_edit = task_id_now;
      $('.edit_task_content2').val(task_content);

      $("#editTaskBtn").unbind('click').click(function(){
        var task_id_edit = task_id_now;
        var task_content2 = $('.edit_task_content2').val();
        var task_member_id2 = $('.task_member_name2 option:selected').data('memberid')
        var task_member_name2 = $('.task_member_name2').val();
        var task_status = task_status_now;
        console.log(task_member_name2)
        var gid = document.getElementById("gid").value;

        $.ajax({  
          type: "POST",
          url: "/task/editTask",
          data: {
              task_id: task_id_edit,
              task_content: task_content2,
              task_member_id:task_member_id2,
              task_member_name:task_member_name2,
              task_status:task_status
          },
          success: function(data){
              if(data){
                  // alert(123);
                  if(data.message=="true"){
                      // alert('修改成功');
                      socket.emit('update task status', {gid:gid, task_id: task_id_edit, taskData:data.taskData})
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
      })
    })
  })

  //點選刪除任務Icon
  $('.deleteTaskIcon').click(function(){
    $taskCardFooter = $(this).parent('.card-footer');
    var task_id_now = $taskCardFooter.data('taskidnow');
    $("#checkRemoveTask").on("show.bs.modal",function(event){
      $("#deleteTaskBtn").unbind('click').click(function(){
        var task_id_delete = task_id_now;
        $.ajax({  
          type: "POST",
          url: "/task/deleteTask",
          data: {
              task_id: task_id_delete,
          },
          success: function(data){
              if(data){
                  // alert(123);
                  if(data.message=="true"){
                      // alert('刪除成功');
                      var gid = document.getElementById("gid").value;
                      socket.emit('delete task', {gid:gid, task_id: task_id_delete})
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
      })
      
    })
  })
}


$(function() {
  addListeners();
  memberSelect();
  var groupsTaskData = JSON.parse($('#groupsTaskData').val());
  showTaskBox(groupsTaskData);

  //傳送要進入房間的資料
  socket.emit('join groups', $('#gid').val());

  //接收加入的房間資料
  socket.on('join room：',function(data){
      console.log(data);
  })

  //接收新增的任務資料
  socket.on('add task data',function(data){
    console.log(data);
    showTaskBox(data);
  })

  //接收刪除的任務資料
  socket.on('delete task data',function(data){
    console.log(data);
    $('#tid'+data).remove();
  })

  //接收更新狀態的任務資料
  socket.on('update task position',function(data){
    $('#tid'+data[0].task_id).remove();
    showTaskBox(data);
  })

  //新增任務class跳出modal
  $('.addTask').on('click', function(){
    var task_status = $(this).data('status');
    $("#addTask").on("show.bs.modal",function(event){
      //新增任務
      $('#addTaskBtn').unbind('click').click(function(){
        var gid = document.getElementById("gid").value;
        var task_content = $('.task_content').val();
        var task_member_id = $('.task_member_name option:selected').data('memberid')
        var task_member_name = $('.task_member_name').val();
        console.log(gid);

        if(task_content == ""){
          alert('請確實填入任務內容');
        }else{
          $.ajax({
            type: "POST",
              url: "/task/addTask",
              data: {
                  groups_id_groups: gid,
                  task_content: task_content,
                  task_member_id:task_member_id, 
                  task_member_name:task_member_name,
                  task_status:task_status
              },
              success: function(data){
                  if(data.message=="true"){
                    socket.emit('add task', {gid:gid, taskData: data.taskData})
                  }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                  }

              },
              error: function(){
                  alert('失敗');
              }
          })
        }
      })
      
    })
  })

});

  
  