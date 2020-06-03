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
	// addProjectDataContent :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		var params = {groups_id_groups:groups_id_groups, project_data_type:project_data_type, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
	// 		connection.query('INSERT INTO `project_data` SET ?', params, function(err, insert_res){
	// 			if(err) throw err;
	// 			cb(insert_res);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//新增研究題目or新增研究動機or新增研究目的(新增project_data資料表的資料)(promise版本)
	addProjectDataContent :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				var params = {groups_id_groups:groups_id_groups, project_data_type:project_data_type, project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
				connection.query('INSERT INTO `project_data` SET ?', params, function(err, insert_res){
					if(err) throw err;
					resolve(insert_res);
					console.log(params);
					connection.release();
				})
			})
		})
	},

	//新增project_data_multi資料表的資料(新增實驗項目、實驗記錄)
	// addProjectDataMultiContent :function(groups_id_groups, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name, cb){
	// 	var groups_id_groups = groups_id_groups;
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		var params = {groups_id_groups:groups_id_groups, project_data_multi_type:project_data_multi_type, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
	// 		connection.query('INSERT INTO `project_data_multi` SET ?', params, function(err,insert_res){
	// 			if(err) throw err;
	// 			cb(insert_res);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//新增實驗項目(新增project_data_multi資料表的資料)(promise版本)
	addProjectDataMultiContent :function(groups_id_groups, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, project_data_multi_type:project_data_multi_type, project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
				connection.query('INSERT INTO `project_data_multi` SET ?', params, function(err,insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					connection.release();
				})
			})
		})
		
	},

	//新增研究設備及器材(新增material資料表的資料)(promise版本)
	addMaterial :function(groups_id_groups, material_name, material_amount, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				var params = {groups_id_groups:groups_id_groups, material_name:material_name, material_amount:material_amount, member_id_member:member_id_member, member_name:member_name};
				connection.query('INSERT INTO `material` SET ?', params, function(err, insert_res){
					if(err) throw err;
					resolve(insert_res);
					console.log(params);
					connection.release();
				})
			})
		})
		
	},
	
	//修改研究題目or修改研究動機(修改project_data資料表中只有單筆的project_data_type的資料)
	//修改研究題目or修改研究動機(修改project_data資料表中只有單筆的project_data_type的資料)(promose版本)
	updateProjectDataContentForOne :function(groups_id_groups, project_data_type, project_data_content, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
				connection.query('UPDATE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"', update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
		
	},

	//修改研究目的(修改project_data資料表中有多筆的project_data_type的資料)
	// updateProjectDataContentForMany :function(groups_id_groups, project_data_id, project_data_type, project_data_content, member_id_member, member_name, cb){
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
	// 		connection.query('UPDAtE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"'+'AND `project_data_id`='+project_data_id, update_params, function(err, update_res){
	// 			if(err) throw err;
	// 			cb(update_res);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//修改研究目的(修改project_data資料表中有多筆的project_data_type的資料)(promise版本)
	updateProjectDataContentForMany :function(groups_id_groups, project_data_id, project_data_type, project_data_content, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {project_data_content:project_data_content, member_id_member:member_id_member, member_name:member_name};
				connection.query('UPDATE `project_data` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_type`='+'"'+project_data_type+'"'+'AND `project_data_id`='+project_data_id, update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//抓取要修改的該筆資料(研究目的)
	selectPurposeEdit :function(project_data_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT `project_data_content` FROM `project_data` WHERE `project_data_id`=?', project_data_id,function(err, result){
					if(err) return reject(err);
					//console.log(result);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//修改研究目的或實驗項目標題的時候同時修改對應欄位中的資料
	updateProjectDataCorrespond :function(groups_id_groups,project_data_multi_type2,origin_data,replace_data){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('UPDATE `project_data_multi` SET `project_data_multi_correspond` = REPLACE(`project_data_multi_correspond`,'+'"'+origin_data+'","'+replace_data+'"'+')'+
				' WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_multi_type`='+'"'+project_data_multi_type2+'"'+'  AND `project_data_multi_correspond` LIKE "%'+origin_data+'%"', function(err, result){
					if(err) return reject(err);
					console.log(result);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//刪除研究目的(刪除project_data資料表中有多筆的project_data_type的其中一筆資料)
	// deleteProjectDataContentForMany :function(project_data_id,cb){
	// 	pool.getConnection(function(err, connection){
	// 		if(err) throw err;
	// 		connection.query('DELETE FROM `project_data` WHERE `project_data_id`=?',project_data_id,function(result){
	// 			if(err) throw err;
	// 			cb(result);
	// 			connection.release();
	// 		})
	// 	})
	// },
	//刪除研究目的(刪除project_data資料表中有多筆的project_data_type的其中一筆資料)(promise版本)
	deleteProjectDataContentForMany :function(project_data_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `project_data` WHERE `project_data_id`=?',project_data_id,function(result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//找出對應項目中有需要刪除研究目的的資料
	selectCorrespondNeedDelete :function(origin_data){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `project_data_multi` WHERE `project_data_multi_correspond` LIKE "%'+origin_data+'%"', function(err, result){
					if(err) return reject(err);
					//console.log(result);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//刪除研究目的或實驗項目同時修改對應欄位，把刪除的那筆重新儲存
	updatePurposesDeleteCorrespond :function(newDataArray){
		return Promise.all(
			newDataArray.map(function(data){
				return new Promise(function(resolve, reject){
					pool.getConnection(function(err, connection){
						if(err) return reject(err);
						var groups_id_groups = data.gid;
						var project_data_multi_id = data.project_data_multi_id;
						var replace_data = data.newCorrespondData;
						connection.query('UPDATE `project_data_multi` SET `project_data_multi_correspond`='+'"'+replace_data+'"'+' WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_multi_id`='+project_data_multi_id, function(err, update_res){
							if(err) return reject(err);
							resolve(update_res);
							connection.release();
						})
					})
				})
			})
		)
	},

	//抓取要修改的該筆資料(實驗項目的實驗項目標題)
	selectExperimentEdit :function(project_data_multi_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT `project_data_multi_title` FROM `project_data_multi` WHERE `project_data_multi_id`=?', project_data_multi_id,function(err, result){
					if(err) return reject(err);
					//console.log(result);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//修改實驗項目(修改project_data_multi資料表中有多筆的project_data_multi_type的資料)
	updateProjectDataMultiContentForMany :function(groups_id_groups, project_data_multi_id, project_data_multi_type, project_data_multi_correspond, project_data_multi_title, project_data_multi_content, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {project_data_multi_correspond:project_data_multi_correspond, project_data_multi_title:project_data_multi_title, project_data_multi_content:project_data_multi_content, member_id_member:member_id_member, member_name:member_name};
				connection.query('UPDATE `project_data_multi` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `project_data_multi_type`='+'"'+project_data_multi_type+'"'+'AND `project_data_multi_id`='+project_data_multi_id, update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//刪除實驗項目(刪除project_data_multi資料表中有多筆的project_data_multi_type的其中一筆資料)(promise版本)
	deleteProjectDataMultiContentForMany :function(project_data_multi_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `project_data_multi` WHERE `project_data_multi_id`=?',project_data_multi_id,function(result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//修改研究設備及器材(修改material資料表中有多筆gid的資料)
	updateMaterialForMany :function(groups_id_groups, material_id, material_name, material_amount, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {material_name:material_name, material_amount:material_amount, member_id_member:member_id_member, member_name:member_name};
				connection.query('UPDATE `material` SET ? WHERE `groups_id_groups`='+groups_id_groups+' AND `material_id`='+material_id, update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//刪除研究設備及器材(刪除material資料表中有多筆gid的資料的其中一筆資料)(promise版本)
	deleteMaterialForMany :function(material_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `material` WHERE `material_id`=?',material_id,function(result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//抓取小組現在編輯階段
	selectGroupsStage : function(groups_id_groups){
		var groups_id_groups = groups_id_groups;
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `groups` WHERE `groups_id`=?', groups_id_groups,function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//修改小組正在編輯階段
	updateStage :function(groups_id, stage_after){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {groups_stage:stage_after};
				connection.query('UPDATE `groups` SET ? WHERE `groups_id`='+groups_id, update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//新增階段切換紀錄
	addStageSwitchRecord :function(groups_id_groups, stage_switch_now, stage_switch_next, stage_switch_reason, stage_switch_status){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, stage_switch_now:stage_switch_now, stage_switch_next:stage_switch_next, stage_switch_reason:stage_switch_reason, stage_switch_status:stage_switch_status};
				connection.query('INSERT INTO `stage_switch` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					console.log(params);
					connection.release();
				})
			})
		})
	},

	//抓取參考資料
	selectReferenceData : function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `reference` WHERE `groups_id_groups`=?', groups_id_groups,function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//新增參考資料
	addReference :function(groups_id_groups, reference_type, reference_content){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, reference_type:reference_type, reference_content:reference_content};
				connection.query('INSERT INTO `reference` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					console.log(params);
					connection.release();
				})

			})
		})
	},

	//刪除參考資料
	deleteReference :function(reference_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `reference` WHERE `reference_id`=?',reference_id,function(result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//抓取階段檢核資料
	selectStageCheck :function(groups_id_groups, stage_check_stage){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) throw err;
				connection.query('SELECT * FROM `stage_check` WHERE `stage_check_stage`=? AND `groups_id_groups`=?', [stage_check_stage, groups_id_groups],function(err, result){
					if(err) throw err;
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//新增階段檢核資料
	addStageCheck :function(groups_id_groups, stage_check_stage, stage_check_status){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, stage_check_stage:stage_check_stage, stage_check_status:stage_check_status};
				connection.query('INSERT INTO `stage_check` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					console.log(params);
					connection.release();
				})
			})
		})
	},

	//修改階段檢核資料
	updateStageCheck :function(groups_id_groups, stage_check_stage, stage_check_status){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {stage_check_status:stage_check_status};
				connection.query('UPDATE `stage_check` SET ? WHERE `groups_id_groups`=? AND `stage_check_stage`=?', [update_params, groups_id_groups, stage_check_stage], function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//抓取所有階段檢核資料
	selectAllStageCheck :function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `stage_check` WHERE `groups_id_groups`=?',  groups_id_groups,function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//抓取所有收斂結果的資料
	selectAllConvergence :function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `convergence` WHERE `groups_id_groups`="'+groups_id_groups+'" AND `node_id_node`!="-1"',  groups_id_groups,function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	}
}