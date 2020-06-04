var pool = require('./db'),
	crypto = require('crypto'),
    fs = require('fs');
    
module.exports = {
    //抓取組員資料
    selectGroupsMemberData :function(groups_id_groups){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT * FROM `groups_member` WHERE `groups_id_groups`="'+groups_id_groups+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //新增任務
    addTask :function(groups_id_groups, task_content, task_member_id, task_member_name){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var params = {groups_id_groups:groups_id_groups, task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name};
				connection.query('INSERT INTO `task` SET ?', params, function(err, insert_res){
					if(err) return reject(err);
					resolve(insert_res);
					connection.release();
				})
			})
		})
    },

    //抓取組別任務資料
    selectGroupsTaskData :function(groups_id_groups){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *, DATE_FORMAT(task_createtime, "%Y-%m-%d %H:%i") AS "task_createtime" FROM `task` WHERE `groups_id_groups`="'+groups_id_groups+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    },

    //修改任務資料
    editTask :function(task_id, task_content, task_member_id, task_member_name, task_status){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {task_content:task_content, task_member_id:task_member_id, task_member_name:task_member_name, task_status:task_status};
                console.log(task_id);
                connection.query('UPDATE `task` SET ? WHERE `task_id`="'+task_id+'"', update_params, function(err, update_res){
					if(err) return reject(err);
                    resolve(update_res);
                    console.log(update_res);
					connection.release();
				})
			})
		})
    },

	//刪除任務資料
	deleteTask :function(task_id){
		return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('DELETE FROM `task` WHERE `task_id`=?',task_id, function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			})
		})
    },
    
    //修改任務狀態
    editTaskStatus :function(task_id, task_status){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				var update_params = {task_status:task_status};
                console.log(task_id);
                connection.query('UPDATE `task` SET ? WHERE `task_id`="'+task_id+'"', update_params, function(err, update_res){
					if(err) return reject(err);
                    resolve(update_res);
                    console.log(update_res);
					connection.release();
				})
			})
		})
    },

    //抓取單筆任務資料
    selectTaskChange :function(task_id){
        return new Promise(function(resolve, reject){
			pool.getConnection(function(err, connection){
				if(err) return reject(err);
				connection.query('SELECT *, DATE_FORMAT(task_createtime, "%Y-%m-%d %H:%i") AS "task_createtime" FROM `task` WHERE `task_id`="'+task_id+'"',function(err, result){
					if(err) return reject(err);
					resolve(result);
					connection.release();
				})
			});
		})
    }

}