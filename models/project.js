var pool = require('./db'),
    crypto = require('crypto');

module.exports = {

	//抓取所有組別資料
	selectAllGroupsData : function(member_id, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `groups`', function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		});
	}

}