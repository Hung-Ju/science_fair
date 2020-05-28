var socket = io();

//summernote編輯器的初始化新增
function summernoteCreate(){
    // var $summernoteNow = $(this).closest('.create-summernote');
    $('.create-summernote').summernote({
        minHeight: 200,
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
            onChange: function(contents, $editable) {
                console.log('onChange:', contents, $editable);
                var gid = $("#gid").val();
                var updateSummernoteData = contents;
                console.log(updateSummernoteData);
                socket.emit('update summernote content', {gid:gid, updateSummernoteData:updateSummernoteData});
            }
        }
    });
}

$(function(){
    summernoteCreate();
    
    //接收改變的summernote資料
    socket.on('update summernote content',function(data){
        console.log(data);
        $('.create-summernote').summernote('code', data);
        // updateNodeData(data);
        console.log('<update summernote content>');
    })
})
