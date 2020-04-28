//建立新的vis畫布
var container = document.getElementById("mynetwork");

//network = new vis.Network(container, data, options);
// var nodes = new vis.DataSet();
// var edges = new vis.DataSet();

// var nodes = new vis.DataSet([
//     {id: 1, label: 'Node 1', group:"idea",x:165,y:25},
//     {id: 2, label: 'Node 2', group:"idea",x:235,y:250},
//     {id: 3, label: 'Node 3', group:"idea",x:500,y:235},
//     {id: 4, label: 'Node 4', group:"idea",x:434,y:25},
//     {id: 5, label: 'Node 5', group:"idea",x:128,y:-356}
//   ]);

var node = [
    { id: "1", group: 'idea', x:165, y:25, node_content: "Node 1", node_text: '111'},
    { id: "2", group: 'rise_above', x:235, y:250, node_content: "Node 2", node_text: '111'},
    { id: "3", group: 'idea', x:500, y:235, node_content: "Node 3", node_text: '111'},
    { id: "4", group: 'vote', x:434, y:25, node_content: "Node 4", node_text: '111'},
    { id: "5", group: 'write', x:128, y:-356, node_content: "Node 5", node_text: '111'}
  ];
  
var edge = [
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
];

// var content = [
//     { id: "1", node_content: "Node 1", node_text: '111'},
//     { id: "2", node_content: "Node 2", node_text: '111'},
//     { id: "3", node_content: "Node 3", node_text: '111'},
//     { id: "4", node_content: "Node 4", node_text: '111'},
//     { id: "5", node_content: "Node 5", node_text: '111'}
//   ]

// var edges = new vis.DataSet([
//     {from: 1, to: 3},
//     {from: 1, to: 2},
//     {from: 2, to: 4},
//     {from: 2, to: 5}
// ]);
var nodeId = [];

var container = document.getElementById('mynetwork');
// var nodeData = {
//     nodes: nodes,
//     edges: edges
// };
var nodeOptions = {
    nodes: {
        size : 16
    },
    groups: {
        idea: {
            // color: {},
            shape: 'image',
            image: '/stylesheets/images/idea(line).svg',
        },
        rise_above: {
            shape: 'image',
            image: '/stylesheets/images/idea(color).svg',
        },
        vote: {
            shape: 'image',
            image: '/stylesheets/images/archive.svg',
        },
        write: {
            shape: 'image',
            image: '/stylesheets/images/organize.svg',
        },
    },
    edges: {
        color:{
            color: "rgba(0,0,0,0.2)",
            highlight: "rgba(0,0,0,0.4)"
        },
        //線的箭頭
        arrows: {
            to: {
                enabled: true
            }
        },
        //線是直線
        smooth: {
            enabled: false
        }
    },
    interaction:{
        multiselect: true
    },
    physics: {
        enabled: false
    }
};

function addNodecontent(){
    //將node陣列中的id存入nodeId陣列中
    for(i=0;i<node.length;i++){
      nodeId.push(node[i].id);
    }
    
    //將文字寫入對應的node節點
    network.on("beforeDrawing", function (ctx) {
        
      var nodePosition = network.getPositions(nodeId);
      
      for(i=0;i<node.length;i++){
        ctx.font = "20px Arial";
        ctx.fillText(node[i].node_content, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y+10);
        ctx.font = "18px Arial";
        ctx.fillText(node[i].node_text, nodePosition[nodeId[i]].x + 30, nodePosition[nodeId[i]].y+30);
      }
    });
  }

function draw() {
  
    // create an array with nodes
    nodes = new vis.DataSet();
    nodes.update(node);
  
    // create an array with edges
    edges = new vis.DataSet();
    edges.update(edge);
    
    data = {
      nodes: nodes,
      edges: edges
    };
    
    network = new vis.Network(container, data, nodeOptions);
    addNodecontent();
  }

//點擊事件
function clickevent(){
    network.on("click", function(params) {
      params.event = "[original event]";
      //var clickid = this.getNodeAt(params.pointer.DOM);

      var clickid = params.nodes;
      //console.log(clickid);
      network.off("beforeDrawing");
      addNodecontent();
      if(clickid.length !== 0){
        drawbackground(clickid)
      }
    });
    
    network.on("doubleClick", function(params) {
      params.event = "[original event]";
      document.getElementById("eventSpan").innerHTML =
        "<h2>doubleClick event:</h2>" + JSON.stringify(params, null, 4);
    });
    
    network.on("oncontext", function(params) {
      params.event = "[original event]";
      document.getElementById("eventSpan").innerHTML =
        "<h2>oncontext (right click) event:</h2>" + JSON.stringify(params, null, 4);
    });
  }

function drawbackground(nodeId){
    network.on("beforeDrawing", function(ctx) {
        // var nodeId = 1;

        $.each(nodeId, function(i, val){
            //console.log(val);
            var id = val;
            var nodePosition = network.getPositions([id]);
            ctx.strokeStyle = "rgba(220, 217, 204, 0.5)";
            ctx.fillStyle = "rgba(220, 217, 204, 0.5)";

            ctx.beginPath();
            //context.arc(x,y,r(半徑),sAngle(起始角),eAngle(結束角),counterclockwise);
            ctx.arc(nodePosition[id].x,nodePosition[id].y,25,0,2 * Math.PI,false);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        })
    });
}
  

$(function(){
    // var network = new vis.Network(container, data, options);
    //var network = new vis.Network(container, nodeData, nodeOptions);
    draw();
    clickevent();
});

