//modal裡的summernote生成
function nodeSummer(){
  $('.nodeEditor').summernote({
      disableDragAndDrop: true,
      disable:true,
      minHeight: 200,
      maxHeight: 200,
      // width: 570,
      toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']]
      ],
      callbacks: {
          onImageUpload: function (files) {
              var imageData = new FormData();
              for (var i = 0; i < files.length; i++){
                  imageData.append("imageData", files[i]);
              }
              var gid = document.getElementById("groups_id").value;
              var T = $(this);
              $.ajax({
                  data: imageData,
                  type: "POST",
                  url: "/project/summernoteUploadImage/"+gid,
                  cache: false,
                  contentType: false,
                  processData: false,
                  success: function (result) {
                      var imageUrlArray = result.imageUrl;
                      if (result.status = "success") {
                          $.each(imageUrlArray, function(i,newUrl){
                              //console.log(imageUrlArray[i].newUrl);
                              newImageUrl = imageUrlArray[i].newUrl
                              T.summernote("insertImage", newImageUrl);
                          })
                      }
                  },
                  error: function () {
                      alert("上傳圖片失敗");
                  }
              });
          }
      }
  })
};
//建立新的vis畫布
var container = document.getElementById("mynetwork");

var allNodeData = document.getElementById("allGroupsNodeData").value;
var node = JSON.parse(allNodeData);
//console.log(node);
  
var edge = [
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
];

// var edges = new vis.DataSet([
//     {from: 1, to: 3},
//     {from: 1, to: 2},
//     {from: 2, to: 4},
//     {from: 2, to: 5}
// ]);
var nodeId = [];

var container = document.getElementById('mynetwork');

var nodeOptions = {
    nodes: {
        size : 16
    },
    groups: {
        idea: {
            shape: 'image',
            image: '/stylesheets/images/idea(line).svg',
        },
        rise_above: {
            shape: 'image',
            image: '/stylesheets/images/idea(color).svg',
        },
        vote: {
            shape: 'image',
            image: '/stylesheets/images/archive.svg',
        },
        motivation: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        purposes: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
    },
    edges: {
        color:{
            color: "rgba(0,0,0,0.2)",
            highlight: "rgba(0,0,0,0.4)"
        },
        //線的箭頭
        arrows: {
            to: {
                enabled: true
            }
        },
        //線是直線
        smooth: {
            enabled: false
        }
    },
    interaction:{
        multiselect: true
    },
    physics: {
        enabled: false
    }
};

function addNodecontent(){
    //將node陣列中的id存入nodeId陣列中
    for(i=0;i<node.length;i++){
      nodeId.push(node[i].id);
    }
    
    //將文字寫入對應的node節點
    network.on("beforeDrawing", function (ctx) {
        
      var nodePosition = network.getPositions(nodeId);
      
      for(i=0;i<node.length;i++){
        ctx.font = "bold 16px 微軟正黑體";
        ctx.fillStyle = "black";
        ctx.fillText(node[i].node_title, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y-10);
        ctx.font = "12px 微軟正黑體";
        ctx.fillStyle = "gray";
        ctx.fillText(node[i].member_name, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y+10);
        ctx.font = "12px 微軟正黑體";
        ctx.fillStyle = "gray";
        ctx.fillText(node[i].node_createtime, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y+30);
      }
    });
}

function draw() { 
    // create an array with nodes
    nodes = new vis.DataSet();
    nodes.update(node);
    // create an array with edges
    edges = new vis.DataSet();
    edges.update(edge);
    
    data = {
      nodes: nodes,
      edges: edges
    };
    
    network = new vis.Network(container, data, nodeOptions);
    addNodecontent();
}

//點擊事件
function clickevent(){
    network.on("click", function(params) {
      params.event = "[click]";
      //var clickid = this.getNodeAt(params.pointer.DOM);
      //console.log(params);
      var clickid = params.nodes;
      network.off("beforeDrawing");
      addNodecontent();
      if(clickid.length !== 0){
        drawbackground(clickid)
      }
    });
    
    network.on("doubleClick", function(params) {
        params.event = "[doubleClick]";
        var clickid = params.nodes[0];
        var member_id = $("#member_id").val();
        var gid = $("#groups_id").val();
        //$("#editAndReadIdea #editAndReadIdeaRoot").text(clickid);
        if(clickid !== undefined){
            //想法節點
            var ajaxData = ajaxGetNodeData(clickid);
            var ajaxNodeData = ajaxData.nodeData;
            var ajaxNodeFile = ajaxData.nodeFile;

            console.log(ajaxNodeData);
            console.log(ajaxNodeFile);
            $('#readIdea-tab').tab('show')
            //是不是想法節點作者的判斷
            if(member_id != ajaxNodeData[0].member_id_member){
                $('#editIdea-tab').hide();
            }else{
                $('#editIdea-tab').show();
            }

            //閱讀想法的tab內容
            var node_tag_data = ajaxNodeData[0].node_tag;
            var node_read_count_plus = ajaxNodeData[0].node_read_count;
            
            $('#readIdea-tab').on('shown.bs.tab', function (e) {
                $("#editAndReadIdeaLongTitle").text(ajaxNodeData[0].node_title)
            })
            var allNodeTagData = node_tag_data.split(',');
            $ReadIdeaRoot = $('#ReadIdeaRoot');
            $ReadIdeaRoot.html("");
            $ReadIdeaRoot.append('<div class="text-right"><i class="far fa-eye" aria-hidden="true"></i>'+node_read_count_plus+'</div>')
            for (var i = 0; i < allNodeTagData.length; i++){
                var tagContent = allNodeTagData[i];
                var tags = ['<span class="badge showTag">'+tagContent+'</span>&nbsp;'];
                $ReadIdeaRoot.append(tags);
            }
            $ReadIdeaRoot.append('<p>'+ajaxNodeData[0].idea_content+'</p>');
            for (var j = 0; j < ajaxNodeFile.length; j++){
                var fileName = ajaxNodeFile[j].file_name;
                var files = ['<a href="/upload_file/group'+gid+'/groups_file/'+fileName+'" download="'+fileName+'"><i class="fas fa-download" aria-hidden="true">&nbsp;</i>'+fileName+'</a><br>'];
                $ReadIdeaRoot.append(files);
            }

            //編輯想法的tab內容
            $('#editIdea-tab').on('shown.bs.tab', function (e) {
                $("#editAndReadIdeaLongTitle").text("修改想法")
            })
            $('#EditIdeaRoot #idea_title_edit').val(ajaxNodeData[0].node_title);
            //var node_tag_data = ajaxNodeData[0].node_tag;
            var node_tag;
            node_tag = node_tag_data.split(',');
            $('.ideaTag').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="idea_tag_edit" id="idea_tag_edit" required="required"></p>')
            tagsInput(node_tag);
            $("#editIdeaSummernote").summernote('code',ajaxNodeData[0].idea_content);
            $("#nodeFiles").empty();
            for (var j = 0; j < ajaxNodeFile.length; j++){
                var fileName = ajaxNodeFile[j].file_name;
                //var fileName2 = '"'+fileName+'"';
                var fileId = ajaxNodeFile[j].file_id;
                var files = ['<div class="files"><a>'+fileName+'</a>&nbsp;<i class="fas fa-times" id="deleteFile'+fileId+'" aria-hidden="true" style="color:red" data-filename="'+fileName+'" data-fileid="'+fileId+'" onclick="deleteFile('+fileId+')"></div>'];
                $("#nodeFiles").append(files);
            }
            
            $("#editAndReadIdea").modal();
            $('#editAndReadIdea').on('shown.bs.modal', function (e) {
                $("#editAndReadIdeaLongTitle").text(ajaxNodeData[0].node_title);
            })
        }
        
        
    });
    
    network.on("oncontext", function(params) {
      params.event = "[original event]";
      document.getElementById("eventSpan").innerHTML =
        "<h2>oncontext (right click) event:</h2>" + JSON.stringify(params, null, 4);
    });
  }

function drawbackground(nodeId){
    network.on("beforeDrawing", function(ctx) {
        // var nodeId = 1;

        $.each(nodeId, function(i, val){
            //console.log(val);
            var id = val;
            var nodePosition = network.getPositions([id]);
            ctx.strokeStyle = "rgba(220, 217, 204, 0.5)";
            ctx.fillStyle = "rgba(220, 217, 204, 0.5)";

            ctx.beginPath();
            //context.arc(x,y,r(半徑),sAngle(起始角),eAngle(結束角),counterclockwise);
            ctx.arc(nodePosition[id].x,nodePosition[id].y,25,0,2 * Math.PI,false);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        })
    });
}; 

function tagsInput(node_tag){
    $('.idea_tag').inputTags({
        autocomplete: {
          values: ['研究動機', '研究目的', '實驗項目', '研究設備及器材', '實驗記錄', '研究結果(分析及圖表)', '討論', '結論'], // autocomplete list
          only: true,
        },
        tags: node_tag,
        editable: false,
        destroy: true,
        create: function() {
            console.log('新物件新增');
          },
      });
};

function ajaxGetNodeData(nodeId){
    var nodeData;
    var nodeFile;
    var gid = document.getElementById("groups_id").value;
    var mode = "想法討論";
    $.ajax({
        url: "/project/"+gid+"/"+mode+"/discussion/readIdea",
        type: "GET",
        async: false,
        //取消同步，等ajax結束後再進行後面的動作
        data: {
            nodeId: nodeId
        },
        success: function(results){
            nodeData=results.nodeData;
            nodeFile=results.nodeFile;
            //console.log(nodeData);
        },
        false: function(){
            alert('帳號已被系統自動登出，請重新登入');
        }
    });
    return {nodeData,nodeFile};
};

function deleteFile(file_id){
    var gid = document.getElementById("groups_id").value;
    var mode = "想法討論";
    $fileNeedDelete = $("#deleteFile"+file_id);
    var fileId = $fileNeedDelete.data("fileid");
    var fileName = $fileNeedDelete.data("filename");
    console.log(fileId);
    $fileNeedDelete.parent('.files').remove();

    $.ajax({
        url: "/project/"+gid+"/"+mode+"/discussion/deleteFile",
        type: "POST",
        data: {
            file_id: fileId,
            file_name: fileName
        },
        success: function(data){
            if(data){
                // alert(123);
                if(data.message=="true"){
                    alert('刪除成功');
                    // window.location.href="/project/?gid="+gid;
                    // window.location.href = "/project/"+gid+"/"+mode;
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
    })
};

function modalHidden() {
    $('#editAndReadIdea').on('hidden.bs.modal', function (e) {
        $('.ideaTag').empty();
    })

    $('#addIdea').on('hidden.bs.modal', function (e) {
        $("#idea_title").val("");
        $('.ideaTag').empty();

    })
}

function modalShown() {
    $('#addIdea').on('show.bs.modal', function(e){
        
        $('.ideaTag').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="idea_tag" id="idea_tag" required="required"></p>');
        tagsInput();
    })
}



$(function(){
    draw();
    clickevent();
    nodeSummer();
    modalShown();
    modalHidden();
    


    //從工具列新增想法節點
    $("#addIdeaBtn").click(function () {
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#idea_title').val();
        var node_tag = $('.idea_tag').val();
        var idea_content = $('.nodeEditor').val();
        var mode = "想法討論";
        var files = document.getElementById('inputGroupFile').files.length;
        var ideaData = new FormData();
        for (var x = 0; x < files; x++) {
            ideaData.append("files", document.getElementById('inputGroupFile').files[x]);
        }

        ideaData.append("gid",gid);
        ideaData.append("node_title",node_title);
        ideaData.append("node_tag",node_tag);
        ideaData.append("idea_content",idea_content);
            
        $.ajax({  
            type: "POST",
            url: "/project/discussion/addIdea",
            data: ideaData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        // window.location.href="/project/?gid="+gid;
                        window.location.href = "/project/"+gid+"/"+mode;
                    }
                    else if(data.message=="same"){
                        alert('小組中有相同的檔案'+data.sameFile+'，請重新選擇');
                    }
                    else if(data.message=="nullContent"){
                        alert('請確實填入標題')
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

    $('.scaffold').on('click', function() {
        var scaffoldText = $(this).text();
        var summernote = $(this).parents(".row").find(".nodeEditor");
        var insertTextHTML = '<span style="background-color: rgb(255, 255, 0);">'+scaffoldText+'</span> ';
        $(summernote).summernote('pasteHTML',insertTextHTML);
        // console.log(summernote);
    });

    $('.deleteFile').click(function() {
        var gid = document.getElementById("groups_id").value;
        var mode = "想法討論";
        var fileId = $(this).data("fileid");
        var fileName = $(this).data("filename");
        console.log($(this));
        $(this).parent('.files').remove();

        $.ajax({
            url: "/project/"+gid+"/"+mode+"/discussion/deleteFile",
            type: "POST",
            data: {
                file_id: fileId,
                file_name: fileName
            },
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('刪除成功');
                        // window.location.href="/project/?gid="+gid;
                        // window.location.href = "/project/"+gid+"/"+mode;
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
        })
    });

    $('.custom-file-input').change(function (e) {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));
    });

});

