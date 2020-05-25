var pool = require('./db'),
	crypto = require('crypto'),
	fs = require('fs');
	
function addNode(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type){
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
}
function addIdea(node_id_node, idea_content){
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
}
function newEdge(fromId, toId, groupId){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `edge` SET?";
        var sqlValue={
            edge_from: fromId,
            edge_to: toId,
            group_id: groupId
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            var newEdgeId = results.insertId;
            console.log('findish edge id='+newEdgeId);
            resolve(newEdgeId);
        });
    });
}
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
	// selectAllGroupsNode :function(groups_id_groups){
	// 	return new Promise(function(resolve, reject){
	// 		pool.getConnection(function(err, connection){
	// 			if(err) return reject(err);
	// 			connection.query('SELECT *,DATE_FORMAT(`node_createtime`, "%Y-%m-%d %H:%i") AS "node_createtime2" FROM `node` WHERE `groups_id_groups`="'+groups_id_groups+'"', function(err, allGroupsNodeData){
	// 				if(err) return reject(err);
	// 				resolve(allGroupsNodeData);
	// 				connection.release();
	// 			})
	// 		})
	// 	})
	// },
	selectAllGroupsNode :function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT n.*, DATE_FORMAT(n.node_createtime, "%Y-%m-%d %H:%i") AS "node_createtime2", COUNT(a.file_id) AS file_count FROM node n LEFT JOIN file a ON n.node_id=a.node_id_node WHERE n.groups_id_groups="'+groups_id_groups+'" GROUP BY n.node_id', function(err, allGroupsNodeData){
					if(err) return reject(err);
					resolve(allGroupsNodeData);
					connection.release();
				})
			})
		})
	},

	//抓取全部edge資料
	selectAllGroupsEdge :function(groups_id_groups){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `edge` WHERE `groups_id_groups`="'+groups_id_groups+'"', function(err, allGroupsEdgeData){
					if(err) return reject(err);
					resolve(allGroupsEdgeData);
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

	//新增edge
	// addEdge :function(edge_from, edge_to, groups_id_groups){
	// 	return new Promise(function(resolve, reject){
	// 		pool.getConnection(function(err, connection){
	// 			if(err) return reject(err);
	// 			var params = {edge_from:edge_from, edge_to:edge_to, groups_id_groups:groups_id_groups};
	// 			connection.query('INSERT INTO `edge` SET ?', params, function(err, insert_res){
	// 				if(err) return reject(err);
	// 				resolve(insert_res);
	// 				//console.log(params);
	// 				connection.release();
	// 			})
	// 		})
	// 	})
	// },
	addEdge :function(edgeDataArray){
		return Promise.all(
			edgeDataArray.map(function(data){
				return new Promise(function(resolve, reject){
					pool.getConnection(function(err, connection){
						if(err) return reject(err);
						var edge_from = data.edge_from;
						var edge_to = data.edge_to;
						var groups_id_groups = data.groups_id_groups;
						var params = {edge_from:edge_from, edge_to:edge_to, groups_id_groups:groups_id_groups};
						connection.query('INSERT INTO `edge` SET ?', params, function(err, insert_res){
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


	//新增想法節點
	// addIdeaNode :function(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type, idea_content, fromNodeId, cb){
	// 	var nodeId;
	// 	addNode(groups_id_groups, member_id_member, member_name, node_title, node_tag, node_type)
	// 	.then(function(result){
	// 		node_id_node = result.insertId;
	// 		return addIdea(node_id_node, idea_content)
	// 	})
	// 	.then(function(result2){
			// if(fromNodeId.length > 0){
			// 	console.log('has fromId');
			// 	var fromNode = fromNodeId.split(',');
			// 	let promises = fromNode.map(function(nodeFrom){
			// 		return newEdge(nodeFrom, node_id_node, groups_id_groups);
			// 	})
			// 	Promise.all(promises)
			// 	.then(function(data){

			// 	})
			// }
	// 	})
	// },

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
						var member_id_member = data.member_id_member;
						var member_name = data.member_name;
						var params = {groups_id_groups:groups_id_groups, node_id_node:node_id_node, file_name:file_name, file_type:file_type, file_share:file_share, member_id_member:member_id_member, member_name:member_name};
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

	//篩選是否存在相同檔名的檔案
	existsFileCheck :function(groups_id_groups,filesDataArray){

		var existsFile = [];
		return new Promise(function(resolve, reject){
			if(filesDataArray.length == 0){
				var sendMessage = 0;
				resolve(sendMessage);
			}else{
				for(var i = 0; i < filesDataArray.length; i++){
					var originalname = filesDataArray[i].originalname;
					var files_path = "./public/upload_file/group"+groups_id_groups+"/groups_file/"+originalname;
					if(fs.existsSync(files_path)){
						existsFile.push(originalname)
					}
				}
				resolve(existsFile);
			}
		})
		// return Promise.all(
		// 	filesDataArray.map(function(data){
				
		// 	})
		// )
	},

	//抓取點擊單一想法節點的內容
	getNodeData :function(node_id_node){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT `node`.*, `idea`.* FROM `node` INNER JOIN `idea` ON `node`.`node_id` WHERE `idea`.`node_id_node`="'+node_id_node+'" AND `node`.`node_id`="'+node_id_node+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//抓取點擊單一想法節點的檔案資料
	getNodeFile :function(node_id_node){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `file` WHERE `node_id_node`="'+node_id_node+'"', function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//新增節點閱讀次數
	updateNodeReadCount :function(node_id_node, node_read_count){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('UPDATE `node` SET `node_read_count`="'+node_read_count+'"  WHERE `node_id`="'+node_id_node+'"', function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//刪除節點中的檔案
	deleteFile :function(file_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `file` WHERE `file_id`=?',file_id, function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//修改節點內容
	updateNode :function(node_id, node_title, node_tag){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {node_title:node_title, node_tag:node_tag};
				connection.query('UPDATE `node` SET ? WHERE `node_id`="'+node_id+'"', update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//修改想法內容
	updateIdea :function(node_id_node, idea_content){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {idea_content:idea_content};
				connection.query('UPDATE `idea` SET ? WHERE `node_id_node`="'+node_id_node+'"', update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//新增參考文獻節點資料
	addReferenceNode :function(node_id_node, groups_id_groups, reference_node_type, reference_node_content, reference_node_idea){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {node_id_node:node_id_node, groups_id_groups:groups_id_groups, reference_node_type:reference_node_type, reference_node_content:reference_node_content, reference_node_idea:reference_node_idea};
				connection.query('INSERT INTO `reference_node` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					//console.log(params);
					connection.release();
				})
			})
		})
	},

	//抓取點擊單一參考文獻節點的內容
	getReferenceNodeData :function(node_id_node){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT `node`.*, `reference_node`.* FROM `node` INNER JOIN `reference_node` ON `node`.`node_id` WHERE `reference_node`.`node_id_node`="'+node_id_node+'" AND `node`.`node_id`="'+node_id_node+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},

	//修改參考文獻節點內容
	updateReferenceNode :function(node_id_node, groups_id_groups, reference_node_type, reference_node_content, reference_node_idea){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {node_id_node:node_id_node, groups_id_groups:groups_id_groups, reference_node_type:reference_node_type, reference_node_content:reference_node_content, reference_node_idea:reference_node_idea};
				connection.query('UPDATE `reference_node` SET ? WHERE `node_id_node`="'+node_id_node+'"', update_params, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
	},

	//抓取剛新增的節點資料
	selectNewNodeData :function(node_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *,DATE_FORMAT(`node_createtime`, "%Y-%m-%d %H:%i") AS "node_createtime2" FROM `node` WHERE `node_id`="'+node_id+'"', function(err, nodeData){
					if(err) return reject(err);
					resolve(nodeData);
					connection.release();
				})
			})
		})
	},

	//抓取剛新增的edge資料
	selectNewEdgeData :function(node_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `edge` WHERE `edge_to`="'+node_id+'"', function(err, nodeData){
					if(err) return reject(err);
					resolve(nodeData);
					connection.release();
				})
			})
		})
	},

	//更新節點位置資料
	updateNodePosition: function(data){
		var dataString=JSON.stringify(data);
        dataString=dataString.replace(/{/g, "(");
        dataString=dataString.replace(/}/g, ")");  
        dataString=dataString.replace(/"node_id":/g,'');
        dataString=dataString.replace(/"x":/g,'');
        dataString=dataString.replace(/"y":/g,'');
        dataString=dataString.substring(1, dataString.length-1);
		console.log(dataString);
		
		var sql="INSERT into `node` (node_id, node_x, node_y) VALUES "
        		+dataString
        		+" ON DUPLICATE KEY UPDATE node_x=VALUES(node_x),node_y=VALUES(node_y)";

		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				//var update_params = {node_x:node_x, node_y:node_y};
				connection.query(sql, function(err, update_res){
					if(err) return reject(err);
					resolve(update_res);
					connection.release();
				})
			})
		})
    },

}