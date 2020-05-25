//小組資源表格的初始化設定
function groupsResourceTable(){
    var allGroupsFileData = document.getElementById("allGroupsFileData").value;
    var allGroupsFile = JSON.parse(allGroupsFileData);
    var $allGroupsFileDataTable = $('#allGroupsFileDataTable');
    console.log(allGroupsFile);
    
    $allGroupsFileDataTable.bootstrapTable({
        columns: [
            {title: '資源名稱', field: 'file_name', sortable: true},
            {title: '類型', field: 'file_type', sortable: true},
            {title: '上傳時間', field: 'file_upload_time', sortable: true},
            {title: '上傳者', field: 'member_name', sortable: true},
            // {title: '', field: 'project_data_id',events: 'window.operateEvents' , formatter: 'researchPurposesButton',width:100}
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered',
        pagination: true,
        search: true,
        
    });
    $allGroupsFileDataTable.bootstrapTable('load',allGroupsFile);
}

$(function(){
    groupsResourceTable();


})