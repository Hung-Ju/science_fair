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
				//console.log(sele_res);
				cb(sele_res);			
				connection.release();
			})
		});
	},

	//抓取所有已登入使用者id未加入的組別id
	selectGroupsIdMemberNotJoin : function(member_id, cb){
		var member_id = member_id;
		var seleArray = [];
		pool.getConnection(function(err, connection){
			if(err) throw err;
			//從小組成員表groups_member裡抓取登入使用者沒有加入的組別id
			connection.query('SELECT `groups_id_groups` FROM `groups_member` WHERE `member_id_member` <> ? ' , [member_id], function(err, sele_res){
				if(err) throw err;				
				if (sele_res){
					//console.log(sele_res);
					for (var i = 0; i < sele_res.length; i++){
						var groups_id = sele_res[i].groups_id_groups;
						pool.getConnection(function(err, connection){
							if(err) throw err;
							//抓取到的組別id去抓取已登入使用者未加入的組別資料
							connection.query('SELECT * FROM `groups` WHERE `groups_id` =?', groups_id, function(err,sele2_res){
								if(err) throw err;
								//sele2_res = JSON.stringify(sele2_res);
								//sele2_res = JSON.parse(sele2_res);
								//seleArray.push(sele2_res);
								//console.log(seleArray);
								console.log(sele2_res);
								//cb(sele2_res);
								connection.release();							
							})
						})
						
						//console.log(sele2_res);
					}	
				}
				connection.release();
			})
		});
	},

	//用selectGroupsIdMemberNotJoin抓取到的組別id去抓取已登入使用者未加入的組別資料
	// selectGroupsDataMemberNotJoin : function(groups_id_groups, cb){
	// 	var groups_id = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `groups` WHERE `groups_id` =?', groups_id, function(err,sele2_res){
	// 			if(err) throw err;
	// 			cb(sele2_res);
	// 			connection.release();
	// 		})
	// 	});
	// },

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