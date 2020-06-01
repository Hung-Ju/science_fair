var pool = require('./db'),
	crypto = require('crypto'),
    fs = require('fs');
    
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
				connection.query('SELECT * FROM `message` WHERE groups_id_groups="'+groups_id_groups+'" AND message_tag="'+message_tag+'" AND message_status="start"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    }
}
