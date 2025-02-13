var socket = io();

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

//referenceNode的summernote生成
function referenceNodeSummernote(){
    $('.referenceEditor').summernote({
        minHeight: 50,
        // width: 575,
        toolbar: [
            ['font', ['bold', 'underline', 'italic', 'clear']],
        ],
    }); 

    // $('#referenceModalRoot .')
}
//建立新的vis畫布
var container = document.getElementById("mynetwork");

var allNodeData = document.getElementById("allGroupsNodeData").value;
var node = JSON.parse(allNodeData);
console.log(node);
var allEdgeData = document.getElementById("allGroupsEdgeData").value;
var edge = JSON.parse(allEdgeData);
//console.log(node);
  
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
        reference: {
            shape: 'image',
            image: '/stylesheets/images/icons/reference.svg',
        },
        convergence: {
            shape: 'image',
            image: '/stylesheets/images/icons/convergence.svg',
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
        experiment: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        material: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        record: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        analysis: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        discussion: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
        conclusion: {
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
        //tag的顯示內容
        var tagsContent="";
        if(node[i].node_tag != ""){
            var tagsContent = '['+node[i].node_tag+']';
        }
        
        ctx.font = "bold 16px 微軟正黑體";
        ctx.fillStyle = "pink";
        var width = ctx.measureText(tagsContent).width;
        ctx.fillRect(nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y-26, width, 20);
        ctx.fillStyle = "black";
        ctx.fillText(tagsContent + node[i].node_title, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y-10);
        

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
    //addNodecontent();
}

function updateNodeData(data){
    console.log(data);
    $.each(data, function(index, value){                    
        nodes.update({
            id: value.node_id,
            x: value.x,
            y: value.y
        });
        if(value.node_title){
            nodes.update({
                id: value.node_id,
                node_title: value.node_title
            });
        }
        if(value.node_tag){
            nodes.update({
                id: value.node_id,
                node_tag: value.node_tag
            });
        }                 
    }); 
}

//點擊事件
var currentNodeId=[];
function clickevent(){
    network.on("click", function(params) {
      params.event = "[click]";
      //var clickid = this.getNodeAt(params.pointer.DOM);
      
      var clickid = params.nodes;
      console.log(clickid);
      //network.off("beforeDrawing");
      //addNodecontent();
      if(clickid.length !== 0){
        //drawbackground(clickid)
        //處理節點資料，要用到groups的資料
        var clickedNode = nodes.get({
            filter: function(item){
                return (params.nodes.includes(item.id));
            }
        })
        var clickedNodeId=[];
        clickedNode.forEach(element => {
            clickedNodeId.push(element.id);
        });
        currentNodeId=clickedNodeId;
      }else{
        currentNodeId.length=0;
      }
    });
    
    network.on("doubleClick", function(params) {
        params.event = "[doubleClick]";
        var clickid = params.nodes[0];
        var member_id = $("#member_id").val();
        var gid = $("#groups_id").val();
        currentNodeId.length=0;
        //$("#editAndReadIdea #editAndReadIdeaRoot").text(clickid);

        //處理節點資料，要用到groups的資料
        var clickedNode = nodes.get({
            filter: function(item){
                return (item.id==clickid);
            }
        })
        currentNodeId.push(clickedNode[0].id);
        //console.log(currentNodeId);
        //console.log(clickedNode);
        var node_group = clickedNode[0].group;
        var node_title = clickedNode[0].node_title;

        

        if(clickid !== undefined){
            //console.log(node_group);
            if(node_group == "idea" || node_group =="rise_above"){
                //想法節點
                var ajaxData = ajaxGetNodeData(clickid);
                var ajaxNodeData = ajaxData.nodeData;
                var ajaxNodeFile = ajaxData.nodeFile;

                //console.log(ajaxNodeData);
                //console.log(ajaxNodeFile);
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

                $('.ideaTagEdit').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="idea_tag_edit" required="required"></p>')
                if (node_tag_data == ""){
                    tagsInput();
                }else{
                    node_tag = node_tag_data.split(',');
                    tagsInput(node_tag);
                }

                $("#editIdeaSummernote").summernote('code',ajaxNodeData[0].idea_content);
                $("#nodeFiles").empty();
                for (var j = 0; j < ajaxNodeFile.length; j++){
                    var fileName = ajaxNodeFile[j].file_name;
                    //var fileName2 = '"'+fileName+'"';
                    var fileId = ajaxNodeFile[j].file_id;
                    var files = ['<div class="files"><a>'+fileName+'</a>&nbsp;<i class="fas fa-times" id="deleteFile'+fileId+'" aria-hidden="true" style="color:red" data-filename="'+fileName+'" data-fileid="'+fileId+'" onclick="deleteFile('+fileId+')"></div>'];
                    $("#nodeFiles").append(files);
                }
                $("#nodeFiles").append('<input type="hidden" id="node_id" value="'+clickid+'">')
                
                $("#editAndReadIdea").modal();
                $('#editAndReadIdea').on('shown.bs.modal', function (e) {
                    $("#editAndReadIdeaLongTitle").text(ajaxNodeData[0].node_title);
                })
                //參考文獻節點
            }else if(node_group == "reference"){
                var ajaxReferenceData = ajaxGetReferenceNodeData(clickid);
                var ajaxNodeData = ajaxReferenceData.nodeData;
                var ajaxNodeFile = ajaxReferenceData.nodeFile;
                console.log(ajaxNodeData);
                console.log(ajaxNodeFile);
                $('#readReference-tab').tab('show')
                //是不是想法節點作者的判斷
                if(member_id != ajaxNodeData[0].member_id_member){
                    $('#editReference-tab').hide();
                }else{
                    $('#editReference-tab').show();
                }

                //閱讀參考文獻的tab內容
                var node_tag_data = ajaxNodeData[0].node_tag;
                var node_read_count_plus = ajaxNodeData[0].node_read_count;
                $('#readReference-tab').on('shown.bs.tab', function (e) {
                    $("#editAndReadReferenceLongTitle").text(ajaxNodeData[0].node_title)
                })
                var allNodeTagData = node_tag_data.split(',');
                $ReadReferenceRoot = $('#ReadReferenceRoot');
                $ReadReferenceRoot.html("");
                $ReadReferenceRoot.append('<div class="text-right"><i class="far fa-eye" aria-hidden="true"></i>'+node_read_count_plus+'</div>')
                for (var i = 0; i < allNodeTagData.length; i++){
                    var tagContent = allNodeTagData[i];
                    var tags = ['<span class="badge showTag">'+tagContent+'</span>&nbsp;'];
                    $ReadReferenceRoot
                    .append(tags);
                }
                $ReadReferenceRoot.append('<p>參考文獻類型：'+ajaxNodeData[0].reference_node_type+'</p>');
                $ReadReferenceRoot.append(ajaxNodeData[0].reference_node_content);
                $ReadReferenceRoot.append(ajaxNodeData[0].reference_node_idea);
                for (var j = 0; j < ajaxNodeFile.length; j++){
                    var fileName = ajaxNodeFile[j].file_name;
                    var files = ['<a href="/upload_file/group'+gid+'/groups_file/'+fileName+'" download="'+fileName+'"><i class="fas fa-download" aria-hidden="true">&nbsp;</i>'+fileName+'</a><br>'];
                    $ReadReferenceRoot.append(files);
                }
                //編輯參考文獻的tab內容
                $('#editReference-tab').on('shown.bs.tab', function (e) {
                    $("#editAndReadReferenceLongTitle").text("修改參考文獻")
                })
                $('#EditReferenceRoot #reference_title_edit').val(ajaxNodeData[0].node_title);
                var node_tag;
                
                $('.referenceTagEdit').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="reference_tag_edit" id="reference_tag_edit" required="required"></p>')
                if (node_tag_data == ""){
                    tagsInput();
                }else{
                    node_tag = node_tag_data.split(',');
                    tagsInput(node_tag);
                }
                
                $('.editSelectReferenceNodeType').val(ajaxNodeData[0].reference_node_type);
                $("#edit_reference_node_content").summernote('code',ajaxNodeData[0].reference_node_content);
                $("#editReferenceNodeIdea").summernote('code',ajaxNodeData[0].reference_node_idea);
                $("#referenceNodeFiles").empty();
                for (var j = 0; j < ajaxNodeFile.length; j++){
                    var fileName = ajaxNodeFile[j].file_name;
                    var fileId = ajaxNodeFile[j].file_id;
                    var files = ['<div class="files"><a>'+fileName+'</a>&nbsp;<i class="fas fa-times" id="deleteFile'+fileId+'" aria-hidden="true" style="color:red" data-filename="'+fileName+'" data-fileid="'+fileId+'" onclick="deleteFile('+fileId+')"></div>'];
                    $("#referenceNodeFiles").append(files);
                }
                $("#referenceNodeFiles").append('<input type="hidden" id="reference_node_id" value="'+clickid+'">')

                //打開參考文獻閱讀和編輯用modal
                $("#editAndReadReference").modal();
                $('#editAndReadReference').on('shown.bs.modal', function (e) {
                    $("#editAndReadReferenceLongTitle").text(ajaxNodeData[0].node_title);
                })
            }else if(node_group == "convergence"){
                var ajaxConvergenceData = ajaxGetConvergenceNodeData(clickid);
                var ajaxNodeData = ajaxConvergenceData.nodeData;
                console.log(ajaxNodeData);

                var node_read_count_plus = ajaxNodeData[0].node_read_count;
                $readConvergenceRoot = $('#ReadConvergenceRoot');
                $readConvergenceRoot.html("");
                $readConvergenceRoot.append('<div class="text-right"><i class="far fa-eye" aria-hidden="true"></i>'+node_read_count_plus+'</div>')
                $readConvergenceRoot.append(ajaxNodeData[0].convergence_content);
                $("#readConvergence").modal();
            }else{
                $readProjectModalRoot = $("#readProjectModalRoot");
                if(node_group == "motivation"){
                    
                }else if(node_group == "purposes"){
                    nodeResearchPurposesTable();
                }else if(node_group == "experiment"){

                }else if(node_group == "material"){

                }else if(node_group == "record"){

                }else if(node_group == "analysis"){

                }else if(node_group == "discussion"){

                }else if(node_group == "conclusion"){

                }
                $("#readProjectModal").modal();
                $('#readProjectModal').on('shown.bs.modal', function (e) {
                    $("#readProjectModalLongTitle").text(node_title);
                })

                alert(node_group);
            }
        } 
        
    });
    
    network.on("oncontext", function(params) {
      params.event = "[rightClick]";
      
      console.log(currentNodeId);
        //若是右鍵在node上，就將那個node加入被選的清單
        if(this.getNodeAt(params.pointer.DOM) && !currentNodeId.includes(this.getNodeAt(params.pointer.DOM))){
            currentNodeId.push(this.getNodeAt(params.pointer.DOM));
            //console.log(currentNodeId);
        }
        //點擊事件時畫灰色圓背景
        //network.off("beforeDrawing");
        //addNodecontent();
        //console.log(currentNodeId);
        var currentNodeIdString = currentNodeId.toString();
        var clickid = currentNodeIdString.split(",");
        //console.log(clickid);
        //若被選清單是空的，就不能使用右鍵的清單
        var $trigger = $('#mynetwork');
        if(currentNodeId.length == 0){
            console.log("沒有選節點")
            $trigger.contextMenu(false);
        }else{
            //點擊事件時畫灰色圓背景
            //drawbackground(clickid);
            $trigger.contextMenu(true);
            this.redraw();
        }
        
    });

    $.contextMenu({
        selector: '#mynetwork', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "addIdea": {
                name: "回覆想法",
                callback: function(itemKey, opt, e){
                    $('#addIdea').modal('show');
                    $("#addIdeaLongTitle").attr("data-nodetype","idea");
                    $("#addIdeaLongTitle").html("新增想法");
                }
            },
            "addRiseAbove": {
                name: "提出昇華的想法",
                callback: function(itemKey, opt, e){
                    $('#addIdea').modal('show');
                    $("#addIdeaLongTitle").attr("data-nodetype","rise_above");
                    $("#addIdeaLongTitle").html("提出昇華的想法");
                }
            },
            "addReferenceNode": {
                name: "提出參考文獻",
                callback: function(itemKey, opt, e){
                    $('#addReferenceNode').modal('show');
                }
            },
        }
    });

    network.on('dragEnd', function(params){
        params.event.preventDefault();
        params.event = "[dragEnd]";
        var gid = document.getElementById("groups_id").value;
        let eventData = JSON.parse(JSON.stringify(params, null, 4));
        let clickedNodeId=eventData.nodes;
        if(clickedNodeId.length > 0){
            let position= network.getPositions(clickedNodeId);
            let updateNodeData=[];
            for(node in position){
                let singleNodeData={
                    node_id: parseInt(node),
                    x: parseInt(position[node].x),
                    y: parseInt(position[node].y),
                };
                updateNodeData.push(singleNodeData);          
            }
            console.log(updateNodeData);
            socket.emit('update node position', {gid:gid, updateNodeData:updateNodeData});
        }        
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
          values: ['研究題目與動機', '研究問題', '實驗項目', '研究設備及器材', '實驗記錄', '研究結果(分析及圖表)', '研究討論', '結論'], // autocomplete list
          only: true,
        },
        tags: node_tag,
        max:1,
        // editable: false,
        // destroy: true,
        create: function() {
            console.log('新物件新增');
            console.log($('.idea_tag').val());
          },
      });
};

//用AJAX抓想法節點的資料
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

//用AJAX抓參考文獻節點的資料
function ajaxGetReferenceNodeData(nodeId){
    var nodeData;
    var nodeFile;
    var gid = document.getElementById("groups_id").value;
    var mode = "想法討論";
    $.ajax({
        url: "/project/"+gid+"/"+mode+"/discussion/readReference",
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

//用AJAX抓收斂結果節點的資料
function ajaxGetConvergenceNodeData(nodeId){
    var nodeData;
    var gid = document.getElementById("groups_id").value;
    var mode = "想法討論";
    $.ajax({
        url: "/project/"+gid+"/"+mode+"/discussion/readConvergence",
        type: "GET",
        async: false,
        //取消同步，等ajax結束後再進行後面的動作
        data: {
            nodeId: nodeId
        },
        success: function(results){
            nodeData=results.nodeData;
            //console.log(nodeData);
        },
        false: function(){
            alert('帳號已被系統自動登出，請重新登入');
        }
    });
    return {nodeData};
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


//modal關閉後必須執行清空內容
function modalHidden() {
    //閱讀和編輯想法節點的modal
    $('#editAndReadIdea').on('hide.bs.modal', function (e) {
        $('.ideaTagEdit').empty();
    })
    //新增想法的Modal
    $('#addIdea').on('hide.bs.modal', function (e) {
        $("#idea_title").val("");
        $('.ideaTag').empty();
    })
    //實作節點的modal
    $('#readProjectModal').on('hide.bs.modal', function (e) {
        $('#readProjectModalRoot').empty();
    })
    //新增參考文獻節點的Modal
    $('#addReferenceNode').on('hide.bs.modal', function (e) {
        $("#reference_title").val("");
        $('.ideaTag').empty();
    })
    //閱讀和編輯參考文獻節點的modal
    $('#editAndReadReference').on('hide.bs.modal', function (e) {
        $('.referenceTagEdit').empty();
    })
    //新增昇華的想法想法的Modal
    $('#addRiseAboveIdea').on('hide.bs.modal', function (e) {
        $("#rise_above_idea_title").val("");
        $('.ideaTag').empty();
    })

};

function modalShown() {
    //新增想法的Modal
    $('#addIdea').on('show.bs.modal', function(e){ 
        $('.ideaTag').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="idea_tag" id="idea_tag" required="required"></p>');
        tagsInput();
    })
    //新增參考文獻節點的Modal
    $('#addReferenceNode').on('show.bs.modal', function(e){ 
        $('.ideaTag').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="reference_tag" id="reference_tag" required="required"></p>');
        tagsInput();
    })
    // //新增昇華的想法的Modal
    // $('#addRiseAboveIdea').on('show.bs.modal', function(e){ 
    //     $('.ideaTag').append('<p><b>標籤</b><input class="form-control idea_tag" type="text" name="idea_tag" id="rise_above_tag" required="required"></p>');
    //     tagsInput();
    // })

    
};

//實作節點中研究題目與動機的內容設定
function nodeResearchTitleAndMotivation(){
    var researchTitleData = $("#researchTitle").val();
    var researchMotivation = $("#researchMotivation").val();

}
//實作節點中研究目的表格的初始化設定
function nodeResearchPurposesTable(){
    var researchPurposesTableData = document.getElementById("researchPurposes").value;
    var allResearchPurposes = JSON.parse(researchPurposesTableData);
    $("#readProjectModalRoot").append('<table id="nodeResearchPurposesTable" class="table"></table>')
    var $nodeResearchPurposesTable = $('#nodeResearchPurposesTable');
    
    $nodeResearchPurposesTable.bootstrapTable({
        columns: [
            {title: '研究問題', field: 'project_data_content'},
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered',
        pagination: true
    });
    $nodeResearchPurposesTable.bootstrapTable('load',allResearchPurposes);
}

$(function(){
    draw();
    clickevent();
    nodeSummer();
    modalShown();
    modalHidden();
    referenceNodeSummernote();

    // $('html, body').css('overflowY', 'hidden');


    if ($("#groups_stage").val() == "形成問題"){
        $('#title1').toast('show');
        $('#title2').toast('show');
        $('#title3').toast('show');
    }else if($("#groups_stage").val() == "研究規劃"){
        $('#title1').remove();
        $('#title2').remove();
        $('#title3').remove();
        $('#step1').toast('show');
        $('#step2').toast('show');
    }else if($("#groups_stage").val() == "執行"){
        $('#title1').remove();
        $('#title2').remove();
        $('#title3').remove();
        $('#step1').remove();
        $('#step2').remove();
        $('#record1').toast('show');
        $('#record2').toast('show');
    }else if($("#groups_stage").val() == "分析與詮釋"){
        $('#title1').remove();
        $('#title2').remove();
        $('#title3').remove();
        $('#step1').remove();
        $('#step2').remove();
        $('#record1').remove();
        $('#record2').remove();
        $('#analysis1').toast('show');
        $('#analysis2').toast('show');
    }else{
        $('#stageIntroduction').hide();
    }

    var times = 0;
    $('#stageIntroduction').click(function(){
        if((times&1)===0){            
            if ($("#groups_stage").val() == "形成問題"){
                $('#title1').toast('hide');
                $('#title2').toast('hide');
                $('#title3').toast('hide');
            }else if($("#groups_stage").val() == "研究規劃"){
                $('#step1').toast('hide');
                $('#step2').toast('hide');
            }else if($("#groups_stage").val() == "執行"){
                $('#record1').toast('hide');
                $('#record2').toast('hide');
            }else if($("#groups_stage").val() == "分析與詮釋"){
                $('#analysis1').toast('hide');
                $('#analysis2').toast('hide');
            }
        }else{
            if ($("#groups_stage").val() == "形成問題"){
                $('#title1').toast('show');
                $('#title2').toast('show');
                $('#title3').toast('show');
            }else if($("#groups_stage").val() == "研究規劃"){
                $('#step1').toast('show');
                $('#step2').toast('show');
            }else if($("#groups_stage").val() == "執行"){
                $('#record1').toast('show');
                $('#record2').toast('show');
            }else if($("#groups_stage").val() == "分析與詮釋"){
                $('#analysis1').toast('show');
                $('#analysis2').toast('show');
            }

        }

        times += 1;      
    })
    
    //addNodecontent();
    socket.on('news',function(data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

    //傳送要進入房間的資料
    socket.emit('join groups', $('#groups_id').val());

    //接收加入的房間資料
    socket.on('join room：',function(data){
        console.log(data);
    })

    //接收新增的節點資料
    socket.on('update node data',function(data){
        nodes.update(data);
        //updateNodeData(data);
        console.log("新增或更新的節點資料"+data);
    })

    //接收新增的edge資料
    socket.on('update edge data',function(data){
        edges.update(data);
        console.log("新增的edge資料"+data)
    })

    //接收改變的節點位置資料
    socket.on('update node position',function(data){
        console.log(data);
        updateNodeData(data);
        console.log('<update node position>');
    })

    //接收新增的節點資料
    socket.on('update reference node data',function(data){
        nodes.update(data);
        console.log("新增的參考文獻節點資料"+data);
    })

    //接收新增的edge資料
    socket.on('update reference edge data',function(data){
        edges.update(data);
        console.log("新增的參考文獻edge資料"+data)
    })

    //將文字寫入對應的node節點
    network.on("beforeDrawing", function (ctx) {
        nodes.forEach(function(data){
            //console.log(data);
            var nodePosition = network.getPositions(data.id);
            //tag的顯示內容
            var tagsContent="";
            if(data.node_tag != ""){
                var tagsContent = '['+data.node_tag+']';
            }
            
            ctx.font = "bold 16px 微軟正黑體";
            ctx.fillStyle = "pink";
            var width = ctx.measureText(tagsContent).width;
            ctx.fillRect(nodePosition[data.id].x + 30, nodePosition[data.id].y-26, width, 20);
            ctx.fillStyle = "black";
            ctx.fillText(tagsContent + data.node_title, nodePosition[data.id].x + 30, nodePosition[data.id].y-10);
            
            // ctx.font = "12px 微軟正黑體";
            // ctx.fillStyle = "gray";
            // ctx.fillText(data.member_name, nodePosition[data.id].x + 30, nodePosition[data.id].y+10);
            // ctx.font = "12px 微軟正黑體";
            // ctx.fillStyle = "gray";
            // ctx.fillText(data.node_createtime, nodePosition[data.id].x + 30, nodePosition[data.id].y+30);

            // var nodeAttachment=nodes.get(value);
            //console.log(data.file_count);
            if(data.file_count> 0){
                ctx.fillStyle = '#aaa';
                ctx.font = '900 12px "Font Awesome 5 free"';
                ctx.fillText('\uf0c6', nodePosition[data.id].x+30, nodePosition[data.id].y+10);                
                ctx.fillStyle = '#555';
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(data.member_name, nodePosition[data.id].x + 45, nodePosition[data.id].y+10);
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(data.node_createtime, nodePosition[data.id].x + 45, nodePosition[data.id].y+30);
            }else{
                ctx.fillStyle = '#555';
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(data.member_name, nodePosition[data.id].x + 30, nodePosition[data.id].y+10);
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(data.node_createtime, nodePosition[data.id].x + 30, nodePosition[data.id].y+30);
            }    

        })
        
        $.each(currentNodeId, function(i, val){
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

    
    //編輯想法節點
    $("#editIdeaBtn").click(function () {
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#idea_title_edit').val();
        var node_tag = $('.idea_tag').val();

        //console.log(node_tag);
        var idea_content = $('#editIdeaSummernote').summernote('code');
        console.log(idea_content);
        var node_id = $('#node_id').val();
        var mode = "想法討論";
        var files = document.getElementById('inputGroupFileEdit').files.length;
        var ideaData = new FormData();
        for (var x = 0; x < files; x++) {
            ideaData.append("files", document.getElementById('inputGroupFileEdit').files[x]);
        }

        ideaData.append("gid",gid);
        ideaData.append("node_title",node_title);
        ideaData.append("node_tag",node_tag);
        ideaData.append("idea_content",idea_content);
        ideaData.append("node_id",node_id);

        $.ajax({  
            type: "POST",
            url: "/project/"+gid+"/"+mode+"/discussion/editIdeaNode",
            data: ideaData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data){
                    if(data.message=="true"){
                        //alert('修改成功');
                        $('#editAndReadIdea').modal('hide');
                        socket.emit('edit idea', {gid:gid, nodeData:data.nodeData});
                        //socket.emit('edit idea', {gid: gid, UpdateIdeaData: UpdateIdeaData});
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

    //從工具列新增想法節點
    $("#addIdeaBtn").click(function () {
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#idea_title').val();
        var node_tag = $('.idea_tag').val();
        var idea_content = $('.nodeEditor').val();
        var mode = "想法討論";
        var files = document.getElementById('inputGroupFile').files.length;
        var node_type = $("#addIdeaLongTitle").attr("data-nodetype");
        var ideaData = new FormData();
        for (var x = 0; x < files; x++) {
            ideaData.append("files", document.getElementById('inputGroupFile').files[x]);
        }

        ideaData.append("gid",gid);
        ideaData.append("node_title",node_title);
        ideaData.append("node_tag",node_tag);
        ideaData.append("idea_content",idea_content);
        ideaData.append('fromNodeId', currentNodeId.toString());
        ideaData.append('node_type', node_type);
            
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
                        $('#addIdea').modal('hide');
                        //console.log(data.edgeData);
                        //console.log(data.nodeData);
                        
                        socket.emit('add node', {gid:gid, nodeData:data.nodeData});
                        socket.emit('add edge', {gid:gid, edgeData:data.edgeData});
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

    //編輯參考文獻的節點
    $("#editReferenceNodeBtn").click(function(){
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#reference_title_edit').val();
        var node_tag = $('.idea_tag').val();
        var node_id = $('#reference_node_id').val();
        var reference_node_type = $("#editSelectReferenceNodeType").val();
        var reference_node_content = $('#edit_reference_node_content').val();
        var reference_node_idea = $('#editReferenceNodeIdea').val();
        var mode = "想法討論";
        var files = document.getElementById('editInputGroupReferenceFile').files.length;
        var referenceData = new FormData();
        for (var x = 0; x < files; x++) {
            referenceData.append("files", document.getElementById('editInputGroupReferenceFile').files[x]);
        }

        referenceData.append("gid",gid);
        referenceData.append("node_title",node_title);
        referenceData.append("node_tag",node_tag);
        referenceData.append("reference_node_type", reference_node_type);
        referenceData.append("reference_node_content",reference_node_content);
        referenceData.append("reference_node_idea",reference_node_idea);
        referenceData.append("node_id", node_id);

        $.ajax({  
            type: "POST",
            url: "/project/"+gid+"/"+mode+"/discussion/editReferenceNode",
            data: referenceData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        //alert('修改成功');
                        $('#editAndReadReference').modal('hide');
                        socket.emit('edit reference', {gid:gid, nodeData:data.nodeData});
                        // window.location.href="/project/?gid="+gid;
                        //window.location.href = "/project/"+gid+"/"+mode;
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

    //從工具列新增參考文獻的節點
    $("#addReferenceNodeBtn").click(function(){
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#reference_title').val();
        var $nodeTag = $('.idea_tag').children('.inputTags-item');
        var node_tag = $('.inputTags-item').attr("data-tag");
        var reference_node_type = $("#selectReferenceNodeType").val();
        var reference_node_content = $('#reference_node_content').val();
        var reference_node_idea = $('#referenceNodeIdea').val();
        var mode = "想法討論";
        var files = document.getElementById('inputGroupReferenceFile').files.length;
        var referenceData = new FormData();
        for (var x = 0; x < files; x++) {
            referenceData.append("files", document.getElementById('inputGroupReferenceFile').files[x]);
        }
        console.log("新增的tag"+node_tag);
        referenceData.append("gid",gid);
        referenceData.append("node_title",node_title);
        referenceData.append("node_tag",node_tag);
        referenceData.append("reference_node_type", reference_node_type);
        referenceData.append("reference_node_content",reference_node_content);
        referenceData.append("reference_node_idea",reference_node_idea);
        referenceData.append('fromNodeId', currentNodeId.toString());

        $.ajax({  
            type: "POST",
            url: "/project/discussion/addReferenceNode",
            data: referenceData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                if(data){
                    // alert(123);
                    if(data.message=="true"){
                        alert('新增成功');
                        $('#addReferenceNode').modal('hide');
                        socket.emit('add reference node', {gid:gid, nodeData:data.nodeData});
                        socket.emit('add reference edge', {gid:gid, edgeData:data.edgeData});
                        // window.location.href="/project/?gid="+gid;
                        //window.location.href = "/project/"+gid+"/"+mode;
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

    //提出昇華的想法節點
    $("#addRiseAboveIdea").click(function () {
        var gid = document.getElementById("groups_id").value;
        var node_title = $('#idea_title').val();
        var node_tag = $('.idea_tag').val();
        var idea_content = $('.nodeEditor').val();
        var mode = "想法討論";
        var files = document.getElementById('inputGroupFile').files.length;
        var node_type = "rise_above";
        var ideaData = new FormData();
        for (var x = 0; x < files; x++) {
            ideaData.append("files", document.getElementById('inputGroupFile').files[x]);
        }

        ideaData.append("gid",gid);
        ideaData.append("node_title",node_title);
        ideaData.append("node_tag",node_tag);
        ideaData.append("idea_content",idea_content);
        ideaData.append('fromNodeId', currentNodeId.toString());
        ideaData.append('node_type', node_type);
            
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


    //KB鷹架工具
    $('.scaffold').on('click', function() {
        var scaffoldText = $(this).text();
        var summernote = $(this).parents(".row").find(".nodeEditor");
        var insertTextHTML = '<span style="background-color: rgb(255, 255, 0);">'+scaffoldText+'</span> ';
        $(summernote).summernote('pasteHTML',insertTextHTML);
        // console.log(summernote);
    });

    //左邊新增節點工具列點擊時清空被點擊的節點記錄
    $('.tool').on('click', function(){
        currentNodeId.length=0;
    });

    //刪除節點中的檔案
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

    $('.addIdea').click(function(){
        $("#addIdeaLongTitle").attr("data-nodetype","idea");
        $("#addIdeaLongTitle").html("新增想法");
    })

    $('.addRiseAbove').click(function(){
        $("#addIdeaLongTitle").attr("data-nodetype","rise_above");
        $("#addIdeaLongTitle").html("提出昇華的想法");
    })

});

