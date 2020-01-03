var pool = require('./db'),
    crypto = require('crypto');

module.exports = {
    // 對字串進行sha1加密
    hash : function(str){
        return crypto.createHmac('sha1', str).update('love').digest('hex');
    },

    //註冊
    reg : function(editor_name, editor_account, editor_password, cb){
		pool.getConnection(function(err, connection){
		    if(err) throw err;

		    connection.query('SELECT `editor_id` FROM `editor` WHERE `editor_account`=?', [editor_account], function(err, sele_res){
		        if(err) throw err;

		        if(sele_res.length){
		        	cb({isExisted:true});
		        	connection.release();
		        }else{
		        	var params = {editor_name:editor_name, editor_account:editor_account, editor_password:editor_password};
		        	connection.query('INSERT INTO `editor` SET ?', params, function(err, insert_res){
				        if(err) throw err;

				        cb(insert_res);
				        connection.release();
				        // 接下来connection已經無法使用，它已經被返回到連接池中
				    })
		        }
		    })
		});
    },

    //登入
    login : function(editor_account, editor_password, cb){
		pool.getConnection(function(err, connection){
		    if(err) throw err;

		    connection.query('SELECT * FROM `editor` WHERE `editor_account`=? AND `editor_password`=?', [editor_account, editor_password], function(err, result){
		        if(err) throw err;

		        cb(result);
		        connection.release();
		        // 接下来connection已經無法使用，它已經被返回到連接池中 
		    })
		});
	}
}