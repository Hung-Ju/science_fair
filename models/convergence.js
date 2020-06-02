var pool = require('./db'),
	crypto = require('crypto'),
	fs = require('fs');
	
//抓取剛新增的留言資料
function selectInsertMessage(message_id){
	return new Promise(function(resolve, reject){
		pool.getConnection(function(err, connection){
			if(err) return reject(err);
			connection.query('SELECT *, DATE_FORMAT(message_createtime, "%Y-%m-%d %H:%i") AS "message_createtime" FROM `message` WHERE message_id="'+message_id+'"',function(err, result){
				if(err) return reject(err);
				resolve(result);
				connection.release();
			})
		});
	})
}
    
module.exports = {
    //抓取某標籤的收斂資料
    selectTagConvergence :function(groups_id_groups, convergence_tag){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `convergence` WHERE groups_id_groups="'+groups_id_groups+'" AND convergence_tag="'+convergence_tag+'" AND node_id_node=-1',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //新增收斂資料
    insertTagConvergence :function(groups_id_groups, convergence_tag){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, convergence_tag:convergence_tag};
				connection.query('INSERT INTO `convergence` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					connection.release();
				})
			})
		})
    },

    //抓取某tag的想法與參考文獻資料
    selectTagIdea :function(groups_id_groups, node_tag){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
                if(err) return reject(err);
                
				connection.query('SELECT n.*, i.*,r.*, DATE_FORMAT(n.node_createtime, "%Y-%m-%d %H:%i") AS "node_createtime" FROM node n LEFT JOIN idea i ON n.node_id=i.node_id_node LEFT JOIN reference_node r ON n.node_id=r.node_id_node WHERE n.groups_id_groups= "'+groups_id_groups+'" AND n.node_tag="'+node_tag+'" GROUP BY n.node_id',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //抓取某tag中狀態status還是start的留言資料
    selectMessage :function(groups_id_groups, message_tag){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *, DATE_FORMAT(message_createtime, "%Y-%m-%d %H:%i") AS "message_createtime" FROM `message` WHERE groups_id_groups="'+groups_id_groups+'" AND message_tag="'+message_tag+'" AND message_status="start"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
	},
	
	//儲存某tag的收斂內容
	updateConvergenceData :function(groups_id_groups, convergence_tag, convergence_content, node_id_node, convergence_ref_node, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {convergence_content:convergence_content, node_id_node:node_id_node, convergence_ref_node:convergence_ref_node, member_id_member:member_id_member, member_name:member_name}
				connection.query('UPDATE `convergence` SET ?  WHERE `groups_id_groups`="'+groups_id_groups+'" AND `convergence_tag`="'+convergence_tag+'" AND `node_id_node`=-1', update_params, function(err, result){
					if(err) return reject(err);
					// console.log(result);
					resolve(result);
					connection.release();
				})
			})
		})
	},

	//新增留言
	insertMessage :function(groups_id_groups, message_tag, message_content, convergence_id_convergence, member_id_member, member_name){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, message_tag:message_tag, message_content:message_content, convergence_id_convergence:convergence_id_convergence, member_id_member:member_id_member, member_name:member_name};
				connection.query('INSERT INTO `message` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					//console.log(params);
					connection.release();
				})
			})
		})
		.then(function(insert_res){
			return selectInsertMessage(insert_res.insertId)
		})
		.then(function(newInsertMessage){
			return newInsertMessage
		})
	},

}
