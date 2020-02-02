//資料填寫欄位Data
var regInputData = [{title: "姓名", type:"text", name:"member_name", useFor: "reg"},
                    {title: "城市", type:"select", name:"member_city", useFor: "reg"},
                    {title: "學校", type:"text", name:"member_school", useFor: "reg"},
                    {title: "帳號", type:"text", name:"member_account", useFor: "all"},
                    {title: "密碼", type:"text", name:"member_password", useFor: "all"}
                    ];

//增加註冊資料填寫欄位
function regInput(){
    var inputAdd = document.getElementById('regRoot');  
    regInputData.map(function(data){
        if (data.type=="text"){
            var html = ['<p>'+ data.title +'<input type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required="required"></p>'];
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

//增加登入資料填寫欄位
function loginInput(){
    var inputAdd = document.getElementById('loginRoot');  
    regInputData.map(function(data){
        if (data.useFor=="all"){
            var html = ['<p>'+ data.title +'<input type="'+data.type+'" name="'+data.name+'"id="'+data.name+'" required="required"></p>'];
            $(inputAdd).append(html);
        }
    })  
};
 


$(function(){
    regInput();
    loginInput();

    //將註冊資料透過ajax傳送執行
    $("#register").click(function () {
        $.ajax({  
            type: "POST",
            url: "/member/reg",
            data: {
                member_name: $("#member_name").val(),
                member_city: $("#member_city").val(),
                member_school: $("#member_school").val(),
                member_account: $("#member_account").val(),
                member_password: $("#member_password").val()
            },
            success: function(data){
                if(data){
                    if(data.message=="false"){
                        alert('帳號重複，請重新輸入');
                    }
                    else{
                        alert('註冊成功，請登入系統');
                        window.location.href="/member/login";
                    }
                }
            },
            error: function(){
                alert('註冊失敗');
            }
        });
    });

    //將登入資料透過ajax傳送執行
    $("#login").click(function () {
        $.ajax({  
            type: "POST",
            url: "/member/login",
            data: {
                member_account: $("#member_account").val(),
                member_password: $("#member_password").val()
            },
            success: function(data){
                if(data){
                    if(data.message=="false"){
                        alert('帳號密碼錯誤，請重新輸入');
                    }
                    else{
                        //alert('歡迎'+req.session.member_name);
                        window.location.href="/groups";
                    }
                }
            },
            error: function(){
                alert('登入失敗');
            }
        });
    });

});