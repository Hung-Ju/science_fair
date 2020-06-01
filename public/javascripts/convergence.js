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
            {title: '留言內容'},
            {title: '留言者'},
            {title: '留言時間'},
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered table-sm',
        pagination: true,
        pageSize: '6',
    });
    $messageTable.bootstrapTable();
}

//tag想法列表顯示
function nodeList(nodeListData){
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
    // convergence_ref_node.remove(refNodeId);

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
                    var convergenceData = data.convergenceData;
                    var $messageTable = $('#messageTable');
                    $messageTable.bootstrapTable('load', data.messageData);
                    nodeList(data.nodeListData);
                    var convergence_ref_node=[];
                    if(convergenceData.convergence_ref_node != undefined){
                        convergence_ref_node.push(convergenceData.convergence_ref_node);
                    }
                    
                    $('.convergenceBox *').attr('disabled', false); 
                    $('#convergence-summernote').summernote("enable");

                    // $('.quoteNote').on('click', function(){
                    //     $nodetext = $(this).closest('.card').find('.card-body');
                    //     var nodeContent=$nodetext.html();
                    //     alert(nodeContent);
                    //     var refNodeId = $(this).data("node_id");
                    //     convergence_ref_node.push(refNodeId);
                    //     $('#convergence-summernote').summernote('pasteHTML', nodeContent);
                    //     $(this).removeClass('btn-primary quoteNote');
                    //     $(this).addClass('btn-secondary reQuoteNote');
                    //     $(this).html('取消引用')
                        
                    // });

                    // console.log(convergenceData);
                    // console.log(data.nodeListData);
                    // console.log(data.messageData);

                }

            },
            error: function(){

            }
        })


        // $('.reQuoteNote').on('click', function(){
        //     var refNodeId = $(this).data("node_id");
        //     convergence_ref_node.remove(refNodeId);
        //     $(this).addClass('btn-primary quoteNote');
        //     $(this).removeClass('btn-secondary reQuoteNote');
        //     $(this).html('引用至收斂空間')
        // });

        // var $uploadModal = $(this).closest('.modal');
        // var file_share = $(this).closest('.modal').attr('id') == 'uploadPersonalFile'?1:0;
        // var fromData = new FormData();
        // var groups_id_groups = document.getElementById("gid").value;
        // var node_id_node = -1;

        // fromData.append('groups_id_groups', groups_id_groups);
        // fromData.append('file_share', file_share);
        // fromData.append('node_id_node', node_id_node);
        
        // if(fromData.has('files')){
        //     $.ajax({
        //         type: "POST",
        //         url: "/resource/addFile",
        //         data: fromData,
        //         cache: false,
        //         contentType: false,
        //         processData: false,
        //         success: function(data){
        //             if(data.message=="true"){
        //                 var insertData = data.fileDataArray;
        //                 if(file_share == 1){
        //                     insertData.forEach(function(value, index){
        //                         $('#allPersonalFileDataTable').bootstrapTable('append', value);
        //                     });
        //                     $uploadModal.modal('hide');

        //                 }else{
        //                     insertData.forEach(function(value, index){
        //                         $('#allGroupsFileDataTable').bootstrapTable('append', value);
        //                     })
        //                     $uploadModal.modal('hide');
        //                 }
        //                 //window.location.href="/resource/"+groups_id_groups;
        //                 // $uploadModal.modal('hide');

        //             }else if(data.message=="same"){
        //                 alert('已經有相同的檔案'+data.sameFile+'，請重新選擇');
        //             }else{
        //                 alert('帳號已被系統自動登出，請重新登入');
        //                 window.location.href="/";
        //             }
        //         },
        //         error: function(){
        //             alert("檔案上傳失敗");
        //         }
                
        //     })
        // }

    });

    $('.quoteNote').on('click', function(){
        console.log("321")
        // var nodeContent=$(this).closest('.card').find('.card-body').text();
        // alert(nodeContent);
        // $('#convergence-summernote').summernote('pasteHTML', nodeContent);
    });
    
})
