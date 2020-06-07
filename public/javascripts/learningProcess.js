var knowledgeBuildScaffold=["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];

function randomRgba(transparency) {
    let o = Math.round, r = Math.random, s = 255;
    let color_r=o(r()*s), color_g=o(r()*s), color_b=o(r()*s);
    return ['rgb('+color_r+','+color_g+','+color_b+')', 'rgba('+color_r+','+color_g+','+color_b+','+transparency+')'];
    // return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
function getOldestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day< curr.day)?prev:curr;
    });
}
function getLatestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day> curr.day)?prev:curr;
    });
}

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


//表格的初始化設定
function scaffoldTable(){
    var ideaScaffold = $('#ideaScaffoldData').val();
    var ideaScaffoldData = JSON.parse(ideaScaffold);
    var $ideaScaffoldTable = $('#ideaScaffoldTable');
    var member_name = $('#member_name').val();

    var tableData =[];
    ideaScaffoldData.scaffoldData.forEach(function(value, index){
        var table_member_name;
        if(value.member_name == member_name){
            table_member_name =  value.member_name;
        }else{
            table_member_name = (String.fromCharCode(65+index));
        }

        var ideaScaffoldTableData ={
            member_id: value.member_id,
            member_name: table_member_name,
            "我想知道":0,
            "我的想法":0,
            "我的理論":0,
            "新資源或參考來源":0,
            "另一個觀點是":0,
            "我覺得更好的想法":0,
            "有發展性的想法":0
        };

        value.count.forEach(function(value){
            var strToJson= JSON.parse(value);
            knowledgeBuildScaffold.forEach(function(value, index){
                if(strToJson[value]){
                    ideaScaffoldTableData[value] = strToJson[value];
                }
            });
        });
        tableData.push(ideaScaffoldTableData);
        // console.log(ideaScaffoldTableData);

    })
    
    $ideaScaffoldTable.bootstrapTable({
        columns: [
            {title: '成員', field: 'member_name',align:'center'},
            {title: '我想知道', field: '我想知道',align:'center'},
            {title: '我的想法', field: '我的想法',align:'center'},
            {title: '我的理論', field: '我的理論',align:'center'},
            {title: '新資源或參考來源', field: '新資源或參考來源',align:'center'},
            {title: '另一個觀點是', field: '另一個觀點是',align:'center'},
            {title: '我覺得更好的想法', field: '我覺得更好的想法',align:'center'},
            {title: '有發展性的想法', field: '有發展性的想法',align:'center'},
            ],
        theadClasses: 'thead-light',
        classes: 'table table-bordered',
        fixedColumns: true,
        fixedNumber: +1,
        height:360
    });
    $ideaScaffoldTable.bootstrapTable('load', tableData);
}

function draw(){
    var socialData = $('#socialNetworkData').val();
    var socialNetworkData = JSON.parse(socialData);
    //社群網絡圖
    var nodes=[], edges=[];
    var nodesMemberData = socialNetworkData.addNodeData;
    var edgesData = socialNetworkData.socialNetworkData;
    nodesMemberData.forEach(function(v, index){
        var id = v.member_id;
        var label = "M"+v.member_id;
        var group = index;
        var value;
        if(v.count.length== 0){
            value = 0;
        }else{
            value = v.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0];
        }
        nodes.push({id:id, label:label, group:group, value:value});
    });
    edgesData.forEach(function(v, index){
        var from = v.from_member_id;
        var to = v.to_member_id;
        var value = v.nodecount;
        edges.push({from:from, to:to, value:value});
    });

    var container2 = document.getElementById("socialNetworkGraph");
    var data = {
    nodes: nodes,
    edges: edges
    };
    var options = {
    nodes: {
        shape: "dot",
        font: {
            size: 32,
            color: "#555"
        },
        borderWidth: 2
    },
    edges: {
        width: 2,
        arrows: "to",
        color: {
            color: "#aaa",
            highlight: "#888"
        }
    },
    physics:{
        enabled: true,
        barnesHut: {
            // theta: 0.5,
            gravitationalConstant: -10000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
        }    
    }
    };
    network = new vis.Network(container2, data, options);
}

$(function(){
    scaffoldTable();
    draw();

    var ideaAction = $('#ideaActionData').val();
    var member_name = $('#member_name').val();
    var ideaActionData = JSON.parse(ideaAction);
    var ideaScaffold = $('#ideaScaffoldData').val();
    var ideaScaffoldData = JSON.parse(ideaScaffold);
    var increaseData = $('#ideaIncreaseData').val();
    var ideaIncreaseData = JSON.parse(increaseData);
    var socialData = $('#socialNetworkData').val();
    var socialNetworkData = JSON.parse(socialData);
    console.log(ideaActionData);
    console.log(ideaScaffoldData);
    console.log(ideaIncreaseData);
    console.log(socialNetworkData);

    var ideaActionMemberList= ideaActionData.addNodeData.map(function(value,index){
        if(value.member_name == member_name){
            return value.member_name;
        }else{
            return (String.fromCharCode(65+index));
        }
    });
    var viewCountList=[], addCountList=[], reviseCountList=[], buildOnCountList=[];

    ideaActionData.addNodeData.forEach(function(value){
        if(value.count.length== 0){
            addCountList.push(0);
        }else{
            addCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }
    });
    ideaActionData.reviseNodeData.forEach(function(value){
        if(value.count.length== 0){
            reviseCountList.push(0);
        }else{
            reviseCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }
    });
    ideaActionData.buildOnNodeData.forEach(function(value){
        if(value.count.length== 0){
            buildOnCountList.push(0);
        }else{
            buildOnCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }       
    });
    ideaActionData.readNodeData.forEach(function(value){
        if(value.count.length== 0){
            viewCountList.push(0);
        }else{
            viewCountList.push(value.count.filter(function(item){return item.number})
            .map(function(item){return item.number})[0]);
        }       
    });
    var ideaActionCTX=document.getElementById('ideaActionCanvas').getContext('2d');
    var ideaActionChart= new Chart(ideaActionCTX, {
        type: 'horizontalBar',
        data: {
            labels: ideaActionMemberList,
            datasets: [{
                label: '檢視',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: viewCountList
            },{
                label: '新增',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: addCountList
            },{
                label: '修改',
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: reviseCountList
            },{
                label: '回覆',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: buildOnCountList
            }]
            
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '次數' 
                    }
                }]
            }
        }
    });


    var ideaScaffoldCTX=document.getElementById('ideaScaffoldCanvas').getContext('2d');
    var ideaScaffoldChart= new Chart(ideaScaffoldCTX, {
        type: 'radar',
        data: {
            labels: knowledgeBuildScaffold,
            datasets: []
        },
        options: {
            scale: {
                ticks:{
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
    var ideaScaffoldMemberList=[];
    ideaScaffoldData.scaffoldData.forEach(function(value, index){
        var scaffoldCountList=[0,0,0,0,0,0,0];
        ideaScaffoldMemberList.push(value.member_name);
        value.count.forEach(function(value){
            var strToJson= JSON.parse(value);
            knowledgeBuildScaffold.forEach(function(value, index){
                if(strToJson[value]){
                    scaffoldCountList[index]+=strToJson[value];
                }
            });
        });
        // console.log(scaffoldCountList);
        var randomColor= randomRgba(0.7);        
        ideaScaffoldChart.data.datasets.push({
            label: value.member_name==member_name?value.member_name:String.fromCharCode(65+index),
            data: scaffoldCountList,
            backgroundColor: randomColor[1],
            borderColor: randomColor[0],
            borderWidth: 1
        });
        ideaScaffoldChart.update();
    })

    
    let container = document.getElementById("ideaIncreaseGraph");
    let names= {};
    var groups = new vis.DataSet();
    ideaScaffoldData.scaffoldData.forEach(function(value, index){
        let dataId= value.member_name == member_name?value.member_name:(String.fromCharCode(65+index));
        names[value.member_id]= dataId;
        groups.add({
            id: dataId,
            content: dataId,
            options: {
                drawPoints: {
                    style: "square", // square, circle
                },
                shaded: {
                    orientation: "bottom", // top, bottom
                },
            }
        });
    });
    let items= [];
    let sum= {};
    ideaIncreaseData.forEach(function(value, index){
        let dataId= names[value.member_id_member];
        if(sum.hasOwnProperty(value.member_id_member)){
            sum[value.member_id_member]+= value.node_count;
        }else{
            sum[value.member_id_member]= value.node_count;
        }        
        items.push({ 
            x: value.day,
            y: sum[value.member_id_member], 
            group: dataId, 
            label: {
                content: sum[value.member_id_member],
                xyOffset: 5
            }});
    });
    let startDate= getOldestDate(ideaIncreaseData).day;
    // console.log(startDate);
    let endtDate= getLatestDate(ideaIncreaseData).day;
    // console.log(endtDate);
    var dataset = new vis.DataSet(items);
    var options = {
        defaultGroup: "ungrouped",
        legend: true,
        start: startDate,
        end: endtDate,
        timeAxis: {
            scale: 'day'
        }
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);


    //節點動作比例圓餅圖

    var viewPieData=[], addPieData=[], revisePieData=[], buildOnPieData=[];
    for(var p = 0; p < ideaActionData.addNodeData.length; p++){
        var addNodeData = ideaActionData.addNodeData[p];
        if(addNodeData.member_name == member_name){
            if(addNodeData.length == 0){
                addPieData.push(0);
            }else{
                addPieData.push(addNodeData.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
                .map(function(item){return item.number})[0]);
            }
        }
    }
    for(var q = 0; q < ideaActionData.reviseNodeData.length; q++){
        var reviseNodeData = ideaActionData.reviseNodeData[q];
        if(reviseNodeData.member_name == member_name){
            if(reviseNodeData.length == 0){
                revisePieData.push(0);
            }else{
                revisePieData.push(reviseNodeData.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
                .map(function(item){return item.number})[0]);
            }
        }
    }
    for(var r = 0; r < ideaActionData.buildOnNodeData.length; r++){
        var buildOnNodeData = ideaActionData.buildOnNodeData[r];
        if(buildOnNodeData.member_name == member_name){
            if(buildOnNodeData.length == 0){
                buildOnPieData.push(0);
            }else{
                buildOnPieData.push(buildOnNodeData.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
                .map(function(item){return item.number})[0]);
            }
        }
    }
    for(var l = 0; l < ideaActionData.readNodeData.length; l++){
        var readNodeData = ideaActionData.readNodeData[l];
        if(readNodeData.member_name == member_name){
            if(readNodeData.length == 0){
                viewPieData.push(0);
            }else{
                viewPieData.push(readNodeData.count.filter(function(item){return item.number})
                .map(function(item){return item.number})[0]);
            }
        }
    }

    var pieData = {
        labels: [
          "檢視",
          "新增",
          "修改",
          "回覆"
        ],
        datasets: [{
          data: [viewPieData[0], addPieData[0], revisePieData[0], buildOnPieData[0]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ]
        }]
      };
      var nodePieCTX = $("#nodePercentCanvas");
      var nodePie = new Chart(nodePieCTX, {
        type: 'pie',
        data: pieData
      });


    
})