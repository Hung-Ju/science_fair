var socket = io();

//summernote編輯器的初始化新增
function summernoteCreate(){
    // var $summernoteNow = $(this).closest('.create-summernote');
    $('.create-summernote').summernote({
        minHeight: 200,
        maxHeight: 200,
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
                        alert("123");

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

        if(convergence_ref_node.includes(node_id) == false){
            var quoteBtn = '<button type="button" data-node_id="'+node_id+'" class="btn btn-primary btn-sm quoteNote" onclick="quote(this)">引用至收斂空間</button>'
        }else{
            var quoteBtn = '<button type="button" data-node_id="'+node_id+'" class="btn btn-secondary btn-sm reQuoteNote" onclick="requote(this)">取消引用</button>'
        }
        var newList = '<div class="card ideaListAll">'+
                          '<p class="card-header">'+
                          '<a class="d-block collapsed" data-toggle="collapse" href="#id'+node_id+'" aria-controls="test" role="button" aria-expanded="false">'+
                          node_title+
                          '<i class="fa fa-chevron-down float-right chevron"></i>'+
                          '</a>'+
                          '</p>'+
                          '<div id="id'+node_id+'" class="collapse">'+
                          '<div class="card-body">'+content+'</div>'+
                          '<div class="card-footer text-right">'+
                          '<small class="text-muted pr-2">建立者： '+member_name+'</small>'+
                          quoteBtn+
                          '</div></div></div>';
        $('.ideaListBody').append(newList);
    })
}

var convergence_ref_node=[];
//引用或取消引用
function quote(node_id){
    $nodetext = $(node_id).closest('.card').find('.card-body');
    var nodeContent=$nodetext.html();
    alert(nodeContent);
    var refNodeId = $(node_id).data("node_id");
    convergence_ref_node.push(refNodeId);
    $('#convergence-summernote').summernote('pasteHTML', nodeContent);
    $(node_id).removeClass('btn-primary quoteNote');
    $(node_id).addClass('btn-secondary reQuoteNote');
    $(node_id).html('取消引用');
    $(node_id).attr("onclick", "requote(this)");
    console.log(convergence_ref_node);

}

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

    // $('html, body').css('overflow', 'hidden');
    $('html, body').css('overflowY', 'hidden');
    $('.convergenceBox *').attr('disabled', true); 
    // $('html, body').css('overflowX', 'hidden');

    $('#changeConvergenceTag').on('click', function(){
        var gid = document.getElementById("groups_id").value;
        var node_tag = $('#tags').val();
        var nodeListTitle = '【'+node_tag+'】想法列表';
        var convergenceTitle = '【'+node_tag+'】收斂空間';
        $('#tagNow').val(node_tag);


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
                    console.log(messageData);
                    
                    if(convergenceData.length != 0){
                        var convergence_ref_node_string = convergenceData[0].convergence_ref_node;
                        convergence_ref_node=convergence_ref_node_string.split(',').map(Number);
                        convergence_content = convergenceData[0].convergence_content;
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

                    
                    $('.convergenceBox *').attr('disabled', false); 
                    $('#convergence-summernote').summernote("enable");
                    $('#convergence-summernote').summernote("code", convergence_content);

                    // $('#messageTable').bootstrapTable('append', data.newInsertMessage);

                    // console.log(convergenceData);
                    // console.log(data.nodeListData);
                    // console.log(data.messageData);

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

    $('#saveIdeaConvergence').on('click', function(){
        var gid = document.getElementById("groups_id").value;
        var convergence_tag = $('#tagNow').val();
        var convergence_content = $('#convergence-summernote').val();
        var convergence_ref_node2 = convergence_ref_node;
        console.log(convergence_ref_node2)

        $.ajax({
            type: "POST",
            url: "/project/convergence/updateConvergenceData",
            data: {
                groups_id_groups: gid,
                convergence_tag: convergence_tag,
                convergence_content: convergence_content,
                convergence_ref_node: convergence_ref_node2.toString()
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
                    alert('留言成功');
                    $('#messageTable').bootstrapTable('append', data.newInsertMessage);
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

    // $('#saveIdeaConvergenceNode').on('click', function(){
    //     var gid = document.getElementById("groups_id").value;
    //     var tagNow = $('#tagNow').val();
    //     var 
    // })

    
})
