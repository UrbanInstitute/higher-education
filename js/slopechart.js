var slopechart_aspect_width = 1;
var slopechart_aspect_height = 0.8;

function slopechart(div, id) {

    data = data_main;
    data.forEach(function (d) {
        d[VAL1] = +d[VAL1]
        d[VAL2] = +d[VAL2]
    });

    var margin = {
        top: 35,
        right: 120,
        bottom: 15,
        left: 120
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {}

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * slopechart_aspect_height) / slopechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y1 = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
            return d[VAL1];
        }))
        .range([height, 0]);

    var yAxis1 = d3.svg.axis()
        .scale(y1)
        .tickFormat(FORMATTER)
        .orient("left");

    var gy1 = svg.append("g")
        .attr("class", "y axis-show")
        .call(yAxis1);

    var y2 = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
            return d[VAL2];
        }))
        .range([height, 0]);

    var yAxis2 = d3.svg.axis()
        .scale(y2)
        .tickFormat(FORMATTER)
        .orient("right");

    var gy2 = svg.append("g")
        .attr("class", "y axis-show")
        .attr("transform", "translate(" + width + " ,0)")
        .call(yAxis2);

    var legend = svg.selectAll("g.legend")
        .data(LABELS)
        .enter().append("g")
        .attr("class", "slope-label");

    legend.append("text")
        .data(LABELS)
        .attr("x", function (d, i) {
            return (i * width);
        })
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return d;
        });

    var lines = svg.selectAll(".state")
        .data(data)
        .enter()
        .append("g");

    lines.append("g")
        .append("line")
        .attr('id', function (d) {
            return d.abbrev;
        })
        .attr("class", "chartline")
        .attr("y1", function (d) {
            return y1(d[VAL1]);
        })
        .attr("y2", function (d) {
            return y2(d[VAL2]);
        })
        .attr("x1", 0)
        .attr("x2", width)
        .attr("stroke", function (d) {
            if (d.abbrev == "US") {
                return "#000";
            } else {
                return "#ccc";
            }
        });
}