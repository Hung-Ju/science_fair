var socket = io();

var convergence_ref_node=[];
var isCheckArray = [];
//summernote編輯器的初始化新增
function summernoteCreate(){
    // var $summernoteNow = $(this).closest('.create-summernote');
    $('.create-summernote').summernote({
        minHeight: 180,
        maxHeight: 180,
        disable:true,
        // width: 600,
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
                //imageData.append("imageData", files[0]);
                //console.log(imageData.files);
                // console.log(files[0]);
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
                        // alert("123");

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
            },
            // onChange: function(contents, $editable) {
            //     console.log('onChange:', contents, $editable);
            //     var gid = $("#gid").val();
            //     var updateSummernoteData = contents;
            //     console.log(updateSummernoteData);
            //     socket.emit('update summernote content', {gid:gid, updateSummernoteData:updateSummernoteData});
            // }
        }
    });
}

//留言板table初始化
function messageTable(){
    var $messageTable = $('#messageTable');
    $messageTable.bootstrapTable({
        // width:300,
        // height:200,
        columns: [
            {title: '留言內容', field: 'message_content'},
            {title: '留言者', field: 'member_name', width:100},
            {title: '留言時間', field: 'message_createtime', width:180},
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered table-sm',
        pagination: true,
        pageSize: '6',
    });
    $messageTable.bootstrapTable();
}

//tag想法列表顯示
function nodeList(nodeListData, convergence_ref_node){
    $('.ideaListBody').html('');

    nodeListData.forEach(function(value){
        var node_id = value.node_id;
        var node_title = value.node_title;
        var member_name = value.member_name;
        if(value.node_type == "idea"){
            var content = value.idea_content;
        }else{
            var content = value.reference_node_idea;
        }

        var newList = '<div class="card ideaListAll">'+
                          '<p class="card-header">'+

                            '<input type="checkbox" class="float-left" style="margin:3px 3px 0 0 " id="'+node_id+'s'+'" name="select_node_id" value="'+node_id+'">'+
                          
                            '<a class="d-block collapsed" data-toggle="collapse" href="#id'+node_id+'" aria-controls="test" role="button" aria-expanded="false">'+
                          node_title+
                          '<i class="fa fa-chevron-down float-right chevron"></i>'+
                          '</a>'+
                          '</p>'+
                          '<div id="id'+node_id+'" class="collapse">'+
                          '<div class="card-body">'+content+'</div>'+
                          '<div class="card-footer text-right">'+
                          '<small class="text-muted pr-2">建立者： '+member_name+'</small>'+
                          '<button type="button" data-node_id="'+node_id+'" class="btn btn-primary btn-sm quoteNote" onclick="quote(this)">引用至收斂空間</button>'+
                          '</div></div></div>';
        $('.ideaListBody').append(newList);
        if(convergence_ref_node.includes(node_id) !== false){
            $("#"+node_id+"s").attr("checked", "checked");
        }
    })

    

}


//引用取消引用
function quote(node_id){
    $nodetext = $(node_id).closest('.card').find('.card-body');
    var nodeContent=$nodetext.html();
    // alert(nodeContent);
    var refNodeId = $(node_id).data("node_id");
    convergence_ref_node.push(refNodeId);
    $('#convergence-summernote').summernote('pasteHTML', nodeContent);
    // $(node_id).removeClass('btn-primary quoteNote');
    // $(node_id).addClass('btn-secondary reQuoteNote');
    // $(node_id).html('取消引用');
    // $(node_id).attr("onclick", "requote(this)");
    // console.log(convergence_ref_node);


}
//取消引用
function requote(node_id){
    var refNodeId = $(node_id).data("node_id");

    convergence_ref_node = convergence_ref_node.filter(function(item){
        return item != refNodeId
    });
    $(node_id).addClass('btn-primary quoteNote');
    $(node_id).removeClass('btn-secondary reQuoteNote');
    $(node_id).html('引用至收斂空間');
    $(node_id).attr("onclick", "quote(this)");
    console.log(convergence_ref_node);
}

$(function(){
    summernoteCreate();
    messageTable();

    //傳送要進入房間的資料
    socket.emit('join groups', $('#groups_id').val());

    //接收加入的房間資料
    socket.on('join room：',function(data){
        console.log(data);
    })

    //接收新增的節點資料
    socket.on('update message data',function(data){
        if(data.message_tag ==$('#tags').val()){
            $('#messageTable').bootstrapTable('append', data.newInsertMessage);
        }
        //updateNodeData(data);
        // console.log("新增或更新的節點資料"+data);
    })


    // $('html, body').css('overflow', 'hidden');
    $('html, body').css('overflowY', 'hidden');
    $('.convergenceBox *').attr('disabled', true); 
    // $('html, body').css('overflowX', 'hidden');
    var isCheckArray = [];
    //選擇要收斂的標籤，並把該標籤的留言和收斂中內容和想法節點抓取出來
    $('#changeConvergenceTag').unbind('click').click(function(){
        var gid = document.getElementById("groups_id").value;
        var node_tag = $('#tags').val();
        var nodeListTitle = '【'+node_tag+'】想法列表';
        var convergenceTitle = '【'+node_tag+'】收斂空間';
        $('#tagNow').val(node_tag);
        $('.convergenceBox *').attr('disabled', true);


        $('.nodeList').html('<i class="fas fa-lightbulb pr-1" aria-hidden="true"></i>'+nodeListTitle);
        $('.convergenceTitle').html('<i class="fas fa-clipboard pr-1" aria-hidden="true"></i>'+convergenceTitle);

        $.ajax({
            type: "POST",
            url: "/project/convergence/selectConvergenceTag",
            data: {
                groups_id_groups: gid,
                tag: node_tag
            },
            success: function(data){
                if(data.message=="true"){
                    convergence_ref_node=[];
                    var nodeListData = [];
                    var convergence_content = "";
                    
                    var convergenceData = data.convergenceData;
                    var messageData = data.messageData;
                    //console.log(convergenceData[0].convergence_ref_node);
                    
                    if(convergenceData[0].convergence_ref_node != ""){
                        var convergence_ref_node_string = convergenceData[0].convergence_ref_node;
                        convergence_ref_node=convergence_ref_node_string.split(',').map(Number);
                        convergence_content = convergenceData[0].convergence_content;
                        console.log(convergence_ref_node);
                        isCheckArray = convergence_ref_node_string.split(',').map(Number);
                    }

                    if(data.nodeListData != undefined){
                        nodeListData = data.nodeListData;
                    }

                    //console.log(convergence_ref_node);
                    
                    var $messageTable = $('#messageTable');
                    $messageTable.bootstrapTable('removeAll');
                    $messageTable.bootstrapTable('append', messageData);
                    nodeList(nodeListData, convergence_ref_node);
                    $('#convergence_id').val(data.convergence_id);
                    $('#ref_count').val(0);
                    $('#ref_count').val(isCheckArray.length);
                    
                     
                    $('#convergence-summernote').summernote("enable");
                    // console.log(convergence_content);
                    $('#convergence-summernote').summernote("code", convergence_content);
                    console.log($('#ref_count').val());
                    // if($('#ref_count').val() == 0 ){
                    //     $('.convergenceBox *').attr('disabled', true);
                    // }else{
                    //     $('.convergenceBox *').attr('disabled', false);
                    // }


                }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                }

            },
            error: function(){
                alert('失敗');
            }
        })


    });

    //儲存編輯中標籤的收斂內容
    $('#saveIdeaConvergence').on('click', function(){
        var gid = document.getElementById("groups_id").value;
        var convergence_tag = $('#tagNow').val();
        var convergence_content = $('#convergence-summernote').val();
        var convergence_ref_node2 = convergence_ref_node;
        // console.log(convergence_ref_node2)
        isCheckArray=[];

        $('input[name="select_node_id"]:checked').each(function() {
            isCheckArray.push($(this).val());
        });
        // convert the array to a string
        // isChecked = isChecked.toString();
        isCheckArray = isCheckArray.toString();
        isCheckArray = isCheckArray.split(',').map(Number);
        // alert(isCheckArray);
    
        // convergence_ref_node=isChecked;
        console.log(isCheckArray)

        $.ajax({
            type: "POST",
            url: "/project/convergence/updateConvergenceData",
            data: {
                groups_id_groups: gid,
                convergence_tag: convergence_tag,
                convergence_content: convergence_content,
                convergence_ref_node: isCheckArray.toString()
            },
            success: function(data){
                if(data.message=="true"){
                    alert('儲存成功');
                }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                }
            },
            error: function(){
                alert('失敗');
            }
        })
    })

    //新增留言
    $('#saveMessage').on('click', function(){
        var gid = document.getElementById("groups_id").value;
        var message_tag = $('#tagNow').val();
        var message_content = $('#message').val();
        var convergence_id_convergence = $('#convergence_id').val();
        //console.log(message_content);

        $.ajax({
            type: "POST",
            url: "/project/convergence/insertConvergenceMessage",
            data: {
                groups_id_groups: gid,
                message_tag: message_tag,
                message_content: message_content,
                convergence_id_convergence: convergence_id_convergence
            },
            success: function(data){
                if(data.message=="true"){
                    // alert('留言成功');
                    // $('#messageTable').bootstrapTable('append', data.newInsertMessage);
                    socket.emit('add message', {gid:gid, newInsertMessage:data.newInsertMessage, message_tag:message_tag})
                }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                }
            },
            error: function(){
                alert('失敗');
            }
        })
    })

    //開啟是否要產生收斂結果的確認modal
    $('#saveIdeaConvergenceNode').on('click', function(){
        $('#checkAddConvergenceNode').modal();
    })

    //產生收斂結果
    $('#checkAddConvergenceNode_btn').on('click', function(){
        var gid = document.getElementById("groups_id").value;
        var tagNow = $('#tagNow').val();
        var convergence_id = $('#convergence_id').val();
        var convergence_content = $('#convergence-summernote').val();
        
        $.ajax({
            type: "POST",
            url: "/project/convergence/insertConvergenceNode",
            data: {
                groups_id_groups: gid,
                tagNow: tagNow,
                convergence_id: convergence_id,
                convergence_ref_node: convergence_ref_node.toString(),
                convergence_content: convergence_content
            },
            success: function(data){
                if(data.message=="true"){
                    alert('收斂節點新增成功');
                    socket.emit('add node', {gid:gid, nodeData:data.nodeData});
                    socket.emit('add edge', {gid:gid, edgeData:data.edgeData});
                    window.location.href="/project/"+gid+"/想法討論/收斂";
                }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                }
            },
            error: function(){
                alert('失敗');
            }
        })
    })

    // if($('#ref_count').val() == 0 ){
    //     $('.convergenceBox *').attr('disabled', true);
    // }else{
    //     $('.convergenceBox *').attr('disabled', false);
    // }
    
})
