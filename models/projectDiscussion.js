var pool = require('./db'),
	crypto = require('crypto'),
    fs = require('fs');
    
module.exports = {

    //抓取節點資料中是否已存在該節點
    selectProjectDataNode :function(groups_id_groups, node_type){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `node` WHERE `node_type`="'+node_type+'" AND `groups_id_groups`="'+groups_id_groups+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //新增專題各階段節點資料
    addProjectDataNode :function(groups_id_groups, member_id_member, member_name, node_title, node_tag , node_type){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, member_id_member:member_id_member, member_name:member_name, node_title:node_title, node_tag:node_tag, node_type:node_type};
				connection.query('INSERT INTO `node` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					//console.log(params);
					connection.release();
				})
			})
		})
	},

	//抓取全部節點資料
	selectAllGroupsNode :function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *,DATE_FORMAT(`node_createtime`, "%Y-%m-%d %T") AS "node_createtime2" FROM `node` WHERE `groups_id_groups`="'+groups_id_groups+'"', function(err, allGroupsNodeData){
					if(err) return reject(err);
					resolve(allGroupsNodeData);
					connection.release();
				})
			})
		})
	},

	//新增節點
	addNode :function(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, member_id_member:member_id_member, member_name:member_name, node_title:node_title, node_tag:node_tag, node_type:node_type};
				connection.query('INSERT INTO `node` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					//console.log(params);
					connection.release();
				})
			})
		})
	},

	//新增想法節點資料
	addIdea :function(node_id_node, idea_content){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {node_id_node:node_id_node, idea_content:idea_content};
				connection.query('INSERT INTO `idea` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					//console.log(params);
					connection.release();
				})
			})
		})
	},

	//新增想法節點中附加的檔案資料
	// addFile :function(groups_id_groups, node_id_node, file_name, file_type, file_share){
	// 	return new Promise(function(resolve, reject){
	// 		pool.getConnection(function(err, connection){
	// 			if(err) return reject(err);
	// 			var params = {groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_share:file_share};
	// 			connection.query('INSERT INTO `file` SET ?', params, function(err, insert_res){
	// 				if(err) return reject(err);
	// 				resolve(insert_res);
	// 				//console.log(params);
	// 				connection.release();
	// 			})
	// 		})
	// 	})
	// }
	addFile :function(filesDataArray){
		return Promise.all(
			filesDataArray.map(function(data){
				return new Promise(function(resolve, reject){
					pool.getConnection(function(err, connection){
						if(err) return reject(err);
						var groups_id_groups = data.groups_id_groups;
						var node_id_node = data.node_id_node;
						var file_name = data.file_name;
						var file_type = data.file_type;
						var file_share = 0;
						var params = {groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_share:file_share};
						connection.query('INSERT INTO `file` SET ?', params, function(err, insert_res){
							if(err) return reject(err);
							resolve(insert_res);
							//console.log(params);
							connection.release();
						})
					})
				})
			})
		)
		
	},

	//篩選是否存在相同檔名的檔案(還沒完成)
	existsFileCheck :function(groups_id_groups,filesDataArray){

		var existsFile = [];
		return Promise.all(
			filesDataArray.map(function(data){
				return new Promise(function(resolve, reject){
					if(data.length == 0){
						var sendMessage = 0;
						resolve(sendMessage);
					}else{
						var originalname = data.originalname;
						var files_path = "./public/upload_file/group"+groups_id_groups+"/groups_file/"+originalname;
						if(fs.existsSync(files_path)){
							existsFile.push(originalname)
						}
						resolve(filesDataArray);
					}
					// pool.getConnection(function(err, connection){
					// 	if(err) return reject(err);
					// 	var groups_id_groups = data.groups_id_groups;
					// 	var node_id_node = data.node_id_node;
					// 	var file_name = data.file_name;
					// 	var file_type = data.file_type;
					// 	var file_share = 0;
					// 	var params = {groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_share:file_share};
					// 	connection.query('INSERT INTO `file` SET ?', params, function(err, insert_res){
					// 		if(err) return reject(err);
					// 		resolve(insert_res);
					// 		//console.log(params);
					// 		connection.release();
					// 	})
					// })
				})
			})
		)
	}
}