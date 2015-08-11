//configure
var COLORS = ["#A2D4EC", "#73BFE2", "#46ABDB", "#1896D2", "#12719E", "#0A4C6A", "#062635"];
var MOBILE_THRESHOLD = 600;
var BREAKS = [4000,8000,12000,16000,20000];

//globals
var data;
var bingraph_data_url = "data/statedata.csv";
var bingraph_aspect_width = 1.5,
    bingraph_aspect_height = 1;
var $bingraph = $('#bingraph');

var isMobile = false;


function bingraph() {
    var margin = {
        top: 20,
        right: 15,
        bottom: 25,
        left: 15
    };
    var width = $bingraph.width() - margin.left - margin.right,
        height = Math.ceil((width * bingraph_aspect_height) / bingraph_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $bingraph.empty();
    
    
    if (width <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var formatAxis = d3.format('.0f');

    var x = d3.scale.ordinal()
        .domain(BREAKS.slice(0, -1))
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, 15])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(COLORS)
        .domain(BREAKS);

    var xAxis = d3.svg.axis()
        .scale(x)
    .outerTickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .orient("left")
        .ticks(6);

    var svg = d3.select("#bingraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("dx", 5)
        .attr("dy", 0);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);


}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(bingraph_data_url, function (error, rates) {
            data = rates;
            bingraph();
            window.onresize = bingraph;
        });
    }
});