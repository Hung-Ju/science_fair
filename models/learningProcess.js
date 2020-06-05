var pool = require('./db'),
	crypto = require('crypto'),
    fs = require('fs');

var knowledgeBuildScaffold=["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];

function getCountScaffold(textContent){
    var countScaffold = [];
    var newObj = new Object();
    knowledgeBuildScaffold.forEach(function(value){
        var re = new RegExp(value, 'g');
        var match = (textContent.match(re));
        if(match){
            var count = match.length;
            newObj[value]= count;
        }
    });
    countScaffold=JSON.stringify(newObj);
    return countScaffold;
}

function getGroupsMemberList(groups_id_groups){
    return new Promise(function(resolve){
        let sql="SELECT member_id_member FROM `groups_member` WHERE groups_id_groups=?";
        pool.query(sql, groups_id_groups, function(err, results){
            if(err) throw err;
            resolve(results);
        });        
    });    
}
  
//抓取新增節點動作資料
function selectAddNodeData(groups_id_groups, member_id_member){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) return reject(err);
            connection.query('SELECT COUNT(node_id) AS number, node_type FROM `node` WHERE member_id_member="'+member_id_member+'" AND groups_id_groups="'+groups_id_groups+'" GROUP BY node_type',function(err, result){
                if(err) return reject(err);
                connection.query('SELECT member_name FROM `member` WHERE member_id=?', member_id_member, function(err, result2){
                    if(err) return reject(err);
                    var addNodeData = {member_id:member_id_member, member_name:result2[0].member_name, count:result};
                    resolve(addNodeData);
                    connection.release();
                })
            })
        });
    })
}

//抓取修改節點動作資料
function selectRevisedNodeData(groups_id_groups, member_id_member){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) return reject(err);
            connection.query('SELECT SUM(node_revised_count) AS number, node_type FROM `node` WHERE member_id_member="'+member_id_member+'" AND groups_id_groups="'+groups_id_groups+'" GROUP BY node_type',function(err, result){
                if(err) return reject(err);
                connection.query('SELECT member_name FROM `member` WHERE member_id=?', member_id_member, function(err, result2){
                    if(err) return reject(err);
                    var addNodeData = {member_id:member_id_member, member_name:result2[0].member_name, count:result};
                    resolve(addNodeData);
                    connection.release();
                })
            })
        });
    })
}

//抓取回覆節點動作資料
function selectBuildOnNodeData(groups_id_groups, member_id_member){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) return reject(err);
            connection.query('SELECT COUNT(n.node_id) AS number, node_type FROM `node` n INNER JOIN `edge` e ON n.node_id=e.edge_to WHERE n.member_id_member="'+member_id_member+'" AND n.groups_id_groups="'+groups_id_groups+'" GROUP BY n.node_type',function(err, result){
                if(err) return reject(err);
                connection.query('SELECT member_name FROM `member` WHERE member_id=?', member_id_member, function(err, result2){
                    if(err) return reject(err);
                    var addNodeData = {member_id:member_id_member, member_name:result2[0].member_name, count:result};
                    resolve(addNodeData);
                    connection.release();
                })
            })
        });
    })
}

//抓取閱讀節點次數動作資料
function selectReadNodeData(groups_id_groups, member_id_member){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) return reject(err);
            connection.query('SELECT `member_node_read_count` AS number FROM `groups_member` WHERE `member_id_member`="'+member_id_member+'" AND `groups_id_groups`="'+groups_id_groups+'"',function(err, result){
                if(err) return reject(err);
                connection.query('SELECT member_name FROM `member` WHERE member_id=?', member_id_member, function(err, result2){
                    if(err) return reject(err);
                    var addNodeData = {member_id:member_id_member, member_name:result2[0].member_name, count:result};
                    resolve(addNodeData);
                    connection.release();
                })
            })
        });
    })
}

//抓取鷹架使用資料
function selectScaffoldData(groups_id_groups, member_id_member){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) return reject(err);
            connection.query('SELECT `idea`.`idea_content` FROM `idea` INNER JOIN `node` ON `idea`.`node_id_node` WHERE `idea`.`node_id_node`=`node`.`node_id` AND `node`.`member_id_member`="'+member_id_member+'" AND `node`.`groups_id_groups`="'+groups_id_groups+'"',function(err, result){
                if(err) return reject(err);
                connection.query('SELECT member_name FROM `member` WHERE member_id=?', member_id_member, function(err, result2){
                    if(err) return reject(err);
                    console.log(result);
                    var scaffoldCountTest = [];
                    if(result.length != 0){
                        for(var i=0; i< result.length; i++){
                            var scaffoldCount = getCountScaffold(result[i].idea_content);
                            scaffoldCountTest.push(scaffoldCount)
                        }
                        
                    }
                    var scaffoldNodeData = {member_id:member_id_member, member_name:result2[0].member_name, count:scaffoldCountTest};
                    resolve(scaffoldNodeData);
                    connection.release();
                })
            })
        });
    })
}



module.exports = {

    //抓取小組想法節點動作資料
    getGroupIdeaAction :function(groups_id_groups){
        return new Promise(function(resolve, reject){
            var groupsMemberListData;
            var addNodeData, buildOnNodeData, reviseNodeData, viewNodeData;
            getGroupsMemberList(groups_id_groups)
            .then(function(memberList){
                groupsMemberListData = memberList;
                var temp = groupsMemberListData;
                var addNodeDataList = temp.map(function(value){
                    return selectAddNodeData(groups_id_groups, value.member_id_member);
                })
                return Promise.all(addNodeDataList);
            })
            .then(function(data){
                addNodeData = data;
                var temp = groupsMemberListData;
                var revisedNodeDataList = temp.map(function(value){
                    return selectRevisedNodeData(groups_id_groups, value.member_id_member);
                })
                return Promise.all(revisedNodeDataList);
                // resolve({addNodeData:addNodeData})
            })
            .then(function(data){
                reviseNodeData = data
                var temp = groupsMemberListData;
                var buildOnNodeDataList = temp.map(function(value){
                    return selectBuildOnNodeData(groups_id_groups, value.member_id_member);
                })
                return Promise.all(buildOnNodeDataList);
                // resolve({addNodeData:addNodeData, reviseNodeData:reviseNodeData})
            })
            .then(function(data){
                buildOnNodeData = data;
                var temp = groupsMemberListData;
                var readNodeDataList = temp.map(function(value){
                    return selectReadNodeData(groups_id_groups, value.member_id_member);
                })
                return Promise.all(readNodeDataList);
                // resolve({addNodeData:addNodeData, reviseNodeData:reviseNodeData, buildOnNodeData:buildOnNodeData})
            })
            .then(function(data){
                readNodeData = data;
                resolve({addNodeData:addNodeData, reviseNodeData:reviseNodeData, buildOnNodeData:buildOnNodeData, readNodeData:readNodeData})
            })
        })
    },

    getScaffoldData :function(groups_id_groups){
        return new Promise(function(resolve, reject){
            var groupsMemberListData;
            var scaffoldData;
            getGroupsMemberList(groups_id_groups)
            .then(function(memberList){
                groupsMemberListData = memberList;
                var temp = groupsMemberListData;
                var scaffoldDataList = temp.map(function(value){
                    return selectScaffoldData(groups_id_groups, value.member_id_member);
                })
                return Promise.all(scaffoldDataList);
            
            })
            .then(function(data){
                scaffoldData = data;
                resolve({scaffoldData:scaffoldData})
            })
        })
    }
}