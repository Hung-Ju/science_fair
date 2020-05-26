var pool = require('./db'),
	crypto = require('crypto'),
	fs = require('fs');

function selectInsertFileData(insertId){
	return new Promise(function(resolve, reject){
		pool.getConnection(function(err, connection){
			if(err) return reject(err);
			connection.query('SELECT *, DATE_FORMAT(file_upload_time, "%Y-%m-%d %H:%i") AS "file_upload_time" FROM `file` WHERE `file_id`="'+insertId+'"', function(err, insert_res){
				if(err) return reject(err);
				resolve(insert_res);
				//console.log(params);
				connection.release();
			})
		})
	})
}
    
module.exports = {
    //抓取小組共享資源
    selectGroupsFile :function(groups_id_groups){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT f.*, DATE_FORMAT(f.file_upload_time, "%Y-%m-%d %H:%i") AS "file_upload_time", n.node_type AS node_type FROM file f LEFT JOIN node n ON n.node_id=f.node_id_node WHERE f.groups_id_groups="'+groups_id_groups+'" AND f.file_share=0 GROUP BY f.file_id',function(err, result){
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
	},

	//篩選個人資料夾是否存在相同檔名的檔案
	existsFileCheckPersonal :function(groups_id_groups, member_id_member, filesDataArray){
		var existsFile = [];
		return new Promise(function(resolve, reject){
			if(filesDataArray.length == 0){
				var sendMessage = 0;
				resolve(sendMessage);
			}else{
				for(var i = 0; i < filesDataArray.length; i++){
					var originalname = filesDataArray[i].originalname;
					var files_path = "./public/upload_file/group"+groups_id_groups+"/groups_member_"+member_id_member+"/"+originalname;
					console.log(files_path);
					if(fs.existsSync(files_path)){
						existsFile.push(originalname)
					}
				}
				resolve(existsFile);
			}
		})
	},

	//新增資源
	addFile :function(filesDataArray){
		var insertFileArray = [];
		return Promise.all(
			filesDataArray.map(function(data){
				return new Promise(function(resolve, reject){
					pool.getConnection(function(err, connection){
						if(err) return reject(err);
						var groups_id_groups = data.groups_id_groups;
						var node_id_node = data.node_id_node;
						var file_name = data.file_name;
						var file_type = data.file_type;
						var file_share = data.file_share;
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
				.then(function(result){
					console.log(result.insertId);
					return selectInsertFileData(result.insertId)
				})
				.then(function(insertFileData){
					console.log(insertFileData)
					insertFileArray.push(insertFileData[0]);
					return insertFileData
				})
			})
		)
		.then(function(){
			return insertFileArray
		})
	},

	//刪除檔案資源
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


}