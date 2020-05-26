
function resourceNameFormatter(value, row, index){
    if(row.file_type=="連結"){
        let link= row.file_name.split(',');
        return link[0];
    }else{
        return row.file_name;
    }
}

//個人資源表格的初始化設定
function personalResourceTable(){
    var allPersonalFileData = document.getElementById("allPersonalFileData").value;
    var allPersonalFile = JSON.parse(allPersonalFileData);
    var $allPersonalFileDataTable = $('#allPersonalFileDataTable');
    //console.log(allGroupsFile);
    
    $allPersonalFileDataTable.bootstrapTable({
        columns: [
            {title: '資源名稱', field: 'file_name', sortable: true, formatter: 'resourceNameFormatter'},
            {title: '類型', field: 'file_type', sortable: true},
            {title: '上傳時間', field: 'file_upload_time', sortable: true, width:200},
            
            {title: '', field: 'file_id',events: 'window.operateEvents' , formatter: 'personalResourceButton'}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered',
        pagination: true,
        search: true,
        
    });
    $allPersonalFileDataTable.bootstrapTable('load',allPersonalFile);
}

function personalResourceButton(value, row, index){
    var buttons='<a class="delete text-danger mr-2" href="javascript:void(0)" title="刪除檔案"><i class="fas fa-trash-alt"></i></a>'
    +'<a class="share text-success mr-2" href="javascript:void(0)" title="分享至小組"><i class="fas fa-share"></i></a>';
    if(row.file_type != '連結'){
        buttons+= '<a class="view text-info" href="javascript:void(0)" title="檢視檔案"><i class="fa fa-download"></i></a>';
    }else{
        buttons+= '<a class="text-info" href="'+row.file_name.split(',')[1]+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>';        
    }
    return buttons;
}

function setAttachmentLink2(fileData){
    var member_id = $("#member_id").val();
    var gid = $("#gid").val();
    var path='/upload_file/group'+gid+'/groups_member_'+member_id+'/'+fileData.file_name;
    
    console.log(path);
    var msg='<a class="btn btn-info btn-sm" href='+path+' download='+fileData.file_name+'><i class="fa fa-download"></i> 下載</a><br><br>';
    var fileNameArray= fileData.file_name.split(".");
    var format = fileNameArray[fileNameArray.length-1];
    format = format.toLowerCase();
    if(format == "png" || format =="jpg" || format =="jpeg"){
        msg += '<img class="img-fluid" height="100%" src="'+path+'" alt='+fileData.file_name+'>';
    }else if(format == "pdf"){
        msg += '<iframe src="'+ path +'" height="500px" width="100%"></iframe>';
    }else if(format == "mp4"){
        msg += '<video width="100%" height="500px" controls><source src="'+path+'" type="video/mp4"></video>';
    }
    return msg;
}

window.operateEvents = {
    'click .view': function (e, value, row) {
        $('#viewFile .modal-header .modal-title').text(row.file_name);
        $('#viewFile .modal-body').html(setAttachmentLink2(row));
        $('#viewFile').modal();
    },
    'click .share': function (e, value, row) {
        console.log(row.file_share)
        $.ajax({
            type: "POST",
            url: "/resource/checkFileExist",
            data: {
                file_id : row.file_id,
                file_name : row.file_name,
                file_share : row.file_share,
                groups_id_groups : $("#gid").val()
            },
            success: function(data){
                if(data.message=="true"){
                    alert("沒有重複");

                }else if(data.message=="same"){
                    alert('已經有相同的檔案'+data.sameFile+'，請修改檔案名稱');
                }else{
                    alert('帳號已被系統自動登出，請重新登入');
                    window.location.href="/";
                }
            },
            error: function(){
                alert("分享失敗");
            }
            
        })
        alert('You click view action, row: ' + JSON.stringify(row))
      },
    'click .delete': function (e, value, row) {
        fileId= row.file_id;
        fileName= row.file_name;
        fileType= row.file_type;
        fileShare= row.file_share;
        let newHTML='';
        if(fileType=='連結'){
            newHTML= '<h5>是否刪除連結( '+row.file_name.split(',')[0]+' )？</h5>';
        }else{
            newHTML= '<h5>是否刪除檔案( '+row.file_name+' )？</h5>';
        }       
        $('#checkRemoveFile .modal-body').html(newHTML);
        $('#checkRemoveFile').modal();
    }
  }

function viewNodeFormatter(value, row, index){
    if(row.node_type=='idea' || row.node_type=='rise_above')
        return '<a class="viewNode" href="javascript:void(0)" title="檢視想法標題"><img height="20rem" src="/stylesheets/images/idea(line).svg" alt="想法"></a>';
    else if(row.node_type=='reference')
        return '<a class="viewNode" href="javascript:void(0)" title="檢視參考文獻標題"><img height="20rem" src="/stylesheets/images/icons/reference.svg" alt="參考文獻"></a>';
    else(row.node_type=='')
        return '';
}

//小組資源表格的初始化設定
function groupsResourceTable(){
    var allGroupsFileData = document.getElementById("allGroupsFileData").value;
    var allGroupsFile = JSON.parse(allGroupsFileData);
    var $allGroupsFileDataTable = $('#allGroupsFileDataTable');
    console.log(allGroupsFile);
    
    $allGroupsFileDataTable.bootstrapTable({
        columns: [
            {field: 'node_type', formatter: 'viewNodeFormatter', events: window.operate, width:40},
            {title: '資源名稱', field: 'file_name', sortable: true, formatter: 'resourceNameFormatter'},
            {title: '類型', field: 'file_type', sortable: true},
            {title: '上傳者', field: 'member_name', sortable: true},
            {title: '上傳時間', field: 'file_upload_time', sortable: true, width:200},
            {title: '', field: 'node_id_node', formatter: 'returnShareButton', width:40},
            {title: '', field: 'project_data_id',events: 'window.operateEvents2' , formatter: 'groupsResourceButton', width:40}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered',
        pagination: true,
        search: true,
        
    });
    $allGroupsFileDataTable.bootstrapTable('load',allGroupsFile);
}

function groupsResourceButton(value, row, index){
    if(row.file_type != '連結'){
        return '<a class="view text-info" href="javascript:void(0)" title="檢視檔案"><i class="fa fa-download"></i></a>';
    }else{
        return '<a class="text-info" href="'+row.file_name.split(',')[1]+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>';        
    }
}

function returnShareButton(value, row, index){
    if(row.node_id_node == -1 && row.member_name == $("#member_name").val())
        return '<a class="share text-warning mr-2" href="javascript:void(0)" title=""><i class="fas fa-reply"></i></a>';
    else
        return '';
}

function setAttachmentLink(fileData){

    var path='/upload_file/group'+fileData.groups_id_groups+'/groups_file/'+fileData.file_name;
    
    console.log(path);
    var msg='<a class="btn btn-info btn-sm" href='+path+' download='+fileData.file_name+'><i class="fa fa-download"></i> 下載</a><br><br>';
    var fileNameArray= fileData.file_name.split(".");
    var format = fileNameArray[fileNameArray.length-1];
    format = format.toLowerCase();
    if(format == "png" || format =="jpg" || format =="jpeg"){
        msg += '<img class="img-fluid" height="100%" src="'+path+'" alt='+fileData.file_name+'>';
    }else if(format == "pdf"){
        msg += '<iframe src="'+ path +'" height="500px" width="100%"></iframe>';
    }else if(format == "mp4"){
        msg += '<video width="100%" height="500px" controls><source src="'+path+'" type="video/mp4"></video>';
    }
    return msg;
}

window.operateEvents2 = {
    'click .view': function (e, value, row) {
        $('#viewFile .modal-header .modal-title').text(row.file_name);
        $('#viewFile .modal-body').html(setAttachmentLink(row));
        $('#viewFile').modal();
    },
  }


$(function(){
    personalResourceTable();
    groupsResourceTable();

    $('.uploadFileButton').on('click', function(){
        var $uploadModal = $(this).closest('.modal');
        var file_share = $(this).closest('.modal').attr('id') == 'uploadPersonalFile'?1:0;
        var fromData = new FormData();
        var groups_id_groups = document.getElementById("gid").value;
        var node_id_node = -1;

        var files = $(this).closest('.modal').find(".custom-file-input")[0].files;
        for (var x = 0; x < files.length; x++){
            fromData.append('files', files[x]);
        }
        fromData.append('groups_id_groups', groups_id_groups);
        fromData.append('file_share', file_share);
        fromData.append('node_id_node', node_id_node);
        
        if(fromData.has('files')){
            $.ajax({
                type: "POST",
                url: "/resource/addFile",
                data: fromData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data){
                    if(data.message=="true"){
                        var insertData = data.fileDataArray;
                        if(file_share == 1){
                            insertData.forEach(function(value, index){
                                $('#allPersonalFileDataTable').bootstrapTable('append', value);
                            });
                            $uploadModal.modal('hide');

                        }else{
                            insertData.forEach(function(value, index){
                                $('#allGroupsFileDataTable').bootstrapTable('append', value);
                            })
                            $uploadModal.modal('hide');
                        }
                        //window.location.href="/resource/"+groups_id_groups;
                        // $uploadModal.modal('hide');

                    }else if(data.message=="same"){
                        alert('已經有相同的檔案'+data.sameFile+'，請重新選擇');
                    }else{
                        alert('帳號已被系統自動登出，請重新登入');
                        window.location.href="/";
                    }
                },
                error: function(){
                    alert("檔案上傳失敗");
                }
                
            })
        }

    })   
    
    $('.uploadLinkButton').on('click', function(){
        var $uploadModal = $(this).closest('.modal');
        var file_share = $(this).closest('.modal').attr('id') == 'sharePersonalLink'?1:0;
        var groups_id_groups = document.getElementById("gid").value;
        var node_id_node = -1;

        if($(this).closest('.modal').find('.linkName').val().trim().length> 0 
            && $(this).closest('.modal').find('.link').val().trim().length> 0){
                var link = [$(this).closest('.modal').find('.linkName').val(), $(this).closest('.modal').find('.link').val()];
                $.ajax({
                    type: "POST",
                    url: "/resource/addLink",
                    data: {
                        node_id_node:node_id_node,
                        file_share:file_share,
                        file_name:link.toString(),
                        groups_id_groups:groups_id_groups
                    },
                    success: function(data){
                        if(data.message=="true"){
                            var insertData = data.fileDataArray;
                            if(file_share == 1){
                                insertData.forEach(function(value, index){
                                    $('#allPersonalFileDataTable').bootstrapTable('append', value);
                                });
                                $uploadModal.modal('hide');

                            }else{
                                insertData.forEach(function(value, index){
                                    $('#allGroupsFileDataTable').bootstrapTable('append', value);
                                })
                                $uploadModal.modal('hide');
                            }
                            // window.location.href="/resource/"+groups_id_groups;
                            // $uploadModal.modal('hide');
                        }else{
                            alert('帳號已被系統自動登出，請重新登入');
                            window.location.href="/";
                        }
                    },
                    error: function(){
                        alert("連結分享失敗");
                    }
                })
            }else{
                alert('連結內容不能空白！');
            }

    })   

    $('#checkRemoveFile_btn').on('click', function(){
        $.ajax({
            url: '/resource/deleteFile',
            type: 'POST',
            data: {
                file_id: fileId,
                file_name: fileName,
                file_type: fileType,
                file_share: fileShare,
                groups_id_groups: $("#gid").val()
            },
            success: function(data){
                if(data){
                    $("#allPersonalFileDataTable").bootstrapTable('remove', {field: 'file_id', values: [fileId]});
                }
            },
            error: function(){
                alert('刪除資源失敗');
            }
        });
    });

    $('.custom-file-input').change(function (e) {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));
    });
})