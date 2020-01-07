var regInputData = [{title: "姓名", type:"text", name:"member_name"},
                    {title: "城市", type:"select", name:"member_city"},
                    {title: "學校", type:"text", name:"member_school"},
                    {title: "帳號", type:"text", name:"member_account"},
                    {title: "密碼", type:"text", name:"member_password"}
                    ];

//增加資料填寫欄位
function regInput(){
    var inputAdd = document.getElementById('root');
    regInputData.map(function(data){
        if (data.type=="text"){
            var html = ['<p>'+ data.title +'<input type="'+data.type+'" name="'+data.name+'" required="required"></p>'];
            $(inputAdd).append(html);
        }
        else {
            var html = ['<p>'+ data.title +'<select name="'+data.name+'">' + 
                            '<option value="Taipei">台北</option>'+
                            '<option value="Taoyuan">桃園</option>'+
                            '<option value="Hsinchu">新竹</option>'+
                            '<option value="Miaoli">苗栗</option>'
                        ];
            $(inputAdd).append(html);
        }
    })  
};


$(function(){
    regInput();

});