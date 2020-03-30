var pool = require('./db'),
    crypto = require('crypto');

module.exports = {

	//抓取專題中研究題目的資料
	selectResearchTitleData : function(groups_id_groups, cb){
		var groups_id_groups = groups_id_groups;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究題目" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		});
	},

	//抓取專題中研究動機的資料
	selectResearchMotivation : function(groups_id_groups, cb){
		var groups_id_groups = groups_id_groups;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究動機" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		});
	},

	//抓取專題中的研究目的的資料
	selectResearchPurposes : function(groups_id_groups, cb){
		var groups_id_groups = groups_id_groups;
		pool.getConnection(function(err, connection){
			if(err) throw err;
			connection.query('SELECT * FROM `project_data` WHERE `project_data_type`="研究目的" AND `groups_id_groups`=?', groups_id_groups,function(err, result){
				if(err) throw err;
				cb(result);
				connection.release();
			})
		})
	}

}