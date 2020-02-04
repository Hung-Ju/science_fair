var pool = require('./db'),
    crypto = require('crypto');

module.exports = {

	//抓取所有已登入使用者id未加入的組別資料
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
			//從小組成員表groups_member裡抓取登入使用者沒有加入的組別id
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
				connection.release();
		    })
		});
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
			})

		});
	}

}