//建立新的vis畫布
var container = document.getElementById("mynetwork");

//network = new vis.Network(container, data, options);
// var nodes = new vis.DataSet();
// var edges = new vis.DataSet();

var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1', group:"idea",x:165,y:25},
    {id: 2, label: 'Node 2', group:"idea",x:235,y:250},
    {id: 3, label: 'Node 3', group:"idea",x:500,y:235},
    {id: 4, label: 'Node 4', group:"idea",x:434,y:25},
    {id: 5, label: 'Node 5', group:"idea",x:128,y:-356}
  ]);

var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

var container = document.getElementById('mynetwork');
var nodeData = {
    nodes: nodes,
    edges: edges
};
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

$(function(){
    // var network = new vis.Network(container, data, options);
    var network = new vis.Network(container, nodeData, nodeOptions);

});

