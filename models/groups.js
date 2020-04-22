var pool = require('./db'),
	crypto = require('crypto'),
	fs = require('fs');

module.exports = {

	//用fs新增檔案儲存需要用的資料夾
	createNewFolder : function(path){
		return new Promise(function(resolve, reject){
			if(!fs.existsSync(path)){
				fs.mkdirSync(path, { recursive: true },function(err, folder){
					if(err) return reject(err);
				})
				resolve(true);
			}
		})
	},

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
	},

	//抓取所有已登入使用者id未加入的組別資料(有錯誤)
	selectGroupsDataMemberNotJoin : function(member_id, cb){
		var member_id = member_id;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			//從小組成員表groups_member裡抓取登入使用者沒有加入的組別id
			connection.query('SELECT `groups`.groups_id,`groups`.groups_name,`groups`.groups_createtime, `groups_member`.groups_member_id, `groups_member`.member_name ' +
							 'FROM `groups` INNER JOIN `groups_member` ON `groups`.groups_id=`groups_member`.groups_id_groups ' +
							 'WHERE `groups_member`.member_id_member <> ? ' , [member_id], function(err, sele_res){
				if(err) throw err;
				cb(sele_res);			
				connection.release();
			})
		});
	},

	//抓取所有已登入使用者id已經加入的組別資料
	selectGroupsDataMemberJoin : function(member_id, cb){
		var member_id = member_id;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			//從小組成員表groups_member裡抓取登入使用者加入的組別id
			connection.query('SELECT `groups`.groups_id,`groups`.groups_name,`groups`.groups_createtime, `groups_member`.groups_member_id, `groups_member`.member_name ' +
							 'FROM `groups` INNER JOIN `groups_member` ON `groups`.groups_id=`groups_member`.groups_id_groups ' +
							 'WHERE `groups_member`.member_id_member = ? ' , [member_id], function(err, sele_res){
				if(err) throw err;
				cb(sele_res);			
				connection.release();
			})
		});
	},

	//新增組別
	addGroups : function(groups_name, groups_key, member_id_student_member, groups_create_student, cb){
		pool.getConnection(function(err, connection){
		    if(err) throw err;
			var params = {groups_name:groups_name, groups_key:groups_key, member_id_student_member:member_id_student_member, groups_create_student:groups_create_student};
		    connection.query('INSERT INTO `groups` SET ?', params, function(err, insert_res){
		        if(err) throw err;
				cb(insert_res);
				console.log(insert_res.insertId);
				connection.release();
				//資料庫處理完INSERT之後，用fs模組新增檔案儲存需要用的資料夾
				var groups_path = "./public/upload_file/group"+insert_res.insertId;
				var summernote_path = "./public/upload_file/group"+insert_res.insertId+"/summernote";
				var groups_file_path = "./public/upload_file/group"+insert_res.insertId+"/groups_file";
				module.exports.createNewFolder(groups_path)
				.then(function(result){
					return module.exports.createNewFolder(summernote_path)
				})
				.then(function(result2){
					return module.exports.createNewFolder(groups_file_path)
				})

		    })
		});
		//console.log(insert_res.insertId);
		// var path = "./public/upload_file/group"+;
	},
	
	//將新增組別的成員記錄到組別成員名單內
	addGroupsMember : function(groups_id_groups, member_id_student_member, groups_create_student, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			var params = {groups_id_groups:groups_id_groups, member_id_member:member_id_student_member, member_name:groups_create_student};
			connection.query('INSERT INTO `groups_member` SET ?', params, function(err, insert_res){
				if(err) throw err;
				cb(insert_res);
				connection.release();
				//資料庫處理完小組成員名單INSERT之後，用fs模組新增個人檔案儲存需要用的資料夾
				var groups_member_path = "./public/upload_file/group"+groups_id_groups+"/groups_member_"+member_id_student_member;
				module.exports.createNewFolder(groups_member_path)
			})

		});
	},

	//未加入組別的成員透過密碼申請加入，比對密碼是否正確
	checkGroupsPassword : function(groups_id, groups_key, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `groups` WHERE `groups_id`=? AND `groups_key`=?', [groups_id, groups_key], function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		});
	},

	//確定該成員尚未加入申請加入的組別
	checkGroupsAlready : function(groups_id, member_id, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `groups_member` WHERE `groups_id_groups`=? AND `member_id_member`=?', [groups_id, member_id], function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		});
	}

}