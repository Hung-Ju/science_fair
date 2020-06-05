var knowledgeBuildScaffold=["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];

function randomRgba(transparency) {
    let o = Math.round, r = Math.random, s = 255;
    let color_r=o(r()*s), color_g=o(r()*s), color_b=o(r()*s);
    return ['rgb('+color_r+','+color_g+','+color_b+')', 'rgba('+color_r+','+color_g+','+color_b+','+transparency+')'];
    // return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
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

$(function(){
    var ideaAction = $('#ideaActionData').val();
    var member_name = $('#member_name').val();
    var ideaActionData = JSON.parse(ideaAction);
    var ideaScaffold = $('#ideaScaffoldData').val();
    var ideaScaffoldData = JSON.parse(ideaScaffold);
    console.log(ideaActionData);
    console.log(ideaScaffoldData);

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
})