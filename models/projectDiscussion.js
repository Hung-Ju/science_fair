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
}