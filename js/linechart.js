//var MOBILE_THRESHOLD = 600;
//configure in each graph call

//globals
var linechart_aspect_width = 1;
var linechart_aspect_height = 0.6;

var yearf = d3.format("02d");

function formatYear(d) {
    return "'" + yearf(Math.abs(2000 - d));
}

function linechart(div, id) {
    var margin = {
        top: 25,
        right: 15,
        bottom: 25,
        left: 40
    };

    if ($LINEDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {
        //NUMTICKS = 7;
        linechart_aspect_height = 1;
    }

    var width = $LINEDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $LINEDIV.empty();

    var formatAxis = d3.format(',0f');

    var x = d3.scale.linear()
        .range([0,width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#ccc"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatYear)
        .ticks(NUMTICKS);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data_long[0]).filter(function (key) {
        return key == "state";
    }));

    data = data_long.map(function (d) {
        return {
            abbrev: d.abbrev,
            year: +d[YEARVAL],
            val: +d[LINEVAL]
        };
    });
    

    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));

    y.domain(d3.extent(data, function (d) {
        return d.val;
    }));

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width)
        .tickFormat(d3.format("%"))
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axislc")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", -4)
        .attr("dy", 2);

    data_nest = d3.nest().key(function (d) {
        return d.abbrev;
    }).entries(data);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.val);
        });

    var states = svg.selectAll(".state")
        .data(data_nest, function (d) {
            return d.key;
        })
        .enter().append("g")
        .attr("class", "state");

    states.append("path")
        .attr("class", "chartline")
        .attr("d", function (d) {
            return line(d.values);
        })
        .attr("id", function (d) {
            return d.key;
        })
        .attr("stroke", function (d) {
            if (d.key == "US") {
                return "#1696d2";
            } else {
                return "#ccc";
            }
        });

}