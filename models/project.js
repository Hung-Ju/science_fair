var pool = require('./db'),
    crypto = require('crypto');

module.exports = {

	//抓取專題中研究題目的資料
	// selectResearchTitleData : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究題目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	});
	// },
	//抓取專題中研究題目的資料(promise版本)
	selectResearchTitleData : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究題目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//抓取專題中研究動機的資料
	// selectResearchMotivation : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究動機" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	});
	// },
	//抓取專題中研究動機的資料(promise版本)
	selectResearchMotivation : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究動機" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//抓取專題中的研究目的的資料
	// selectResearchPurposes : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究目的" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//抓取專題中的研究目的的資料
	selectResearchPurposes : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究目的" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//抓取專題中的實驗項目的資料
	// selectResearchExperiment : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="實驗項目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//抓取專題中的實驗項目的資料(promise版本)
	selectResearchExperiment : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="實驗項目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})	
	},

	//抓取專題中的研究設備及器材的資料
	// selectResearchMaterial : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `material` WHERE `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//抓取專題中的研究設備及器材的資料(promise版本)
	selectResearchMaterial : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `material` WHERE `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//抓取專題中的實驗紀錄的資料
	// selectResearchRecord : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="實驗記錄" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//抓取專題中的實驗紀錄的資料(promise版本)
	selectResearchRecord : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="實驗記錄" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})	
	},

	//抓取專題中的研究結果(分析及圖表)的資料
	// selectResearchAnalysis : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="研究結果" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//抓取專題中的研究結果(分析及圖表)的資料(promise版本)
	selectResearchAnalysis : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_type`="研究結果" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})	
	},

	
	//抓取專題中的討論的資料
	// selectResearchDiscussion : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="討論" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },

	//抓取專題中的討論的資料(promise版本)
	selectResearchDiscussion : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="討論" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//抓取專題中的結論的資料
	// selectResearchConclusionData : function(groups_id_groups, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究題目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	});
	// },
	//抓取專題中的結論的資料(promise版本)
	selectResearchConclusion : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="結論" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//新增研究題目or新增研究動機or新增研究目的(新增project_data資料表的資料)
	addProjectDataContent :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name, cb){
		var groups_id_groups = groups_id_groups;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			var params = {groups_id_groups:groups_id_groups, project_data_type:project_data_type, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
			connection.query('INSERT INTO `project_data` SET ?', params, function(err, insert_res){
				if(err) throw err;
				cb(insert_res);
				connection.release();
			})
		})
	},

	//新增實驗項目(新增project_data_multi資料表的資料)
	addProjectDataMultiContent :function(groups_id_groups, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name, cb){
		var groups_id_groups = groups_id_groups;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			var params = {groups_id_groups:groups_id_groups, project_data_multi_type:project_data_multi_type, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
			connection.query('INSERT INTO `project_data_multi` SET ?', params, function(err,insert_res){
				if(err) throw err;
				cb(insert_res);
				connection.release();
			})
		})
	},
	
	//修改研究題目or修改研究動機(修改project_data資料表中只有單筆的project_data_type的資料)
	updateProjectDataContentForOne :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
			connection.query('UPDATE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"', update_params, function(err, update_res){
				if(err) throw err;
				cb(update_res);
				connection.release();
			})
		})
	},

	//修改研究目的(修改project_data資料表中有多筆的project_data_type的資料)
	updateProjectDataContentForMany :function(groups_id_groups, project_data_id, project_data_type, project_data_content, member_id_member, member_name, cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
			connection.query('UPDAtE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"'+'AND `project_data_id`='+project_data_id, update_params, function(err, update_res){
				if(err) throw err;
				cb(update_res);
				connection.release();
			})
		})
	},

	//刪除研究目的(刪除project_data資料表中有多筆的project_data_type的其中一筆資料)
	deleteProjectDataContentForMany :function(project_data_id,cb){
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('DELETE FROM `project_data` WHERE `project_data_id`=?',project_data_id,function(result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		})
	}


	//修改研究題目
	// updateResearchTitle :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name, cb){
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
	// 		connection.query('UPDATE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"', update_params, function(err, update_res){
	// 			if(err) throw err;
	// 			cb(update_res);
	// 			connection.release();
	// 		})
	// 	})
	// },

	//修改研究動機(和修改研究題目一樣)
	// updateResearchMotivation :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name, cb){
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
	// 		connection.query('UPDATE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"', update_params, function(err, update_res){
	// 			if(err) throw err;
	// 			cb(update_res);
	// 			connection.release();
	// 		})
	// 	})
	// },

}