var pool = require('./db'),
    crypto = require('crypto');

module.exports = {
    // 對字串進行md5加密
    hash : function(str){
        return crypto.createHmac('md5', str).update(str).digest('hex');
    },

    //註冊
    reg : function(member_name,member_city,member_school,member_account,member_password, cb){
		pool.getConnection(function(err, connection){
		    if(err) throw err;

		    connection.query('SELECT `member_id` FROM `member` WHERE `member_account`=?', [member_account], function(err, sele_res){
		        if(err) throw err;

		        if(sele_res.length){
		        	cb({isExisted:true});
		        	connection.release();
		        }else{
		        	var params = {member_name:member_name, member_city:member_city, member_school:member_school, member_account:member_account, member_password:member_password};
		        	connection.query('INSERT INTO `member` SET ?', params, function(err, insert_res){
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
    login : function(member_account, member_password, cb){
		pool.getConnection(function(err, connection){
		    if(err) throw err;

		    connection.query('SELECT * FROM `member` WHERE `member_account`=? AND `member_password`=?', [member_account, member_password], function(err, result){
		        if(err) throw err;

		        cb(result);
		        connection.release();
		        // 接下来connection已經無法使用，它已經被返回到連接池中 
		    })
		});
	}
}