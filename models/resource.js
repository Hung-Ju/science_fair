var pool = require('./db'),
	crypto = require('crypto'),
    fs = require('fs');
    
module.exports = {
    //抓取小組共享資源
    selectGroupsFile :function(groups_id_groups){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *, DATE_FORMAT(file_upload_time, "%Y-%m-%d %H:%i") AS "file_upload_time" FROM `file` WHERE `groups_id_groups`="'+groups_id_groups+'" AND `file_share`="0"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //抓取個人資源
    selectPersonalFile :function(groups_id_groups, member_id_member){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *, DATE_FORMAT(file_upload_time, "%Y-%m-%d %H:%i") AS "file_upload_time" FROM `file` WHERE `groups_id_groups`="'+groups_id_groups+'" AND `member_id_member`="'+member_id_member+'" AND `file_share`="1"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },
}