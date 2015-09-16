var slopechart_aspect_width = 1;
var slopechart_aspect_height = 0.9;
var slopechart3_aspect_height = 1.6;

function slopechart(div, id) {

    data = data_main;
    data.forEach(function (d) {
        d[VAL[0]] = +d[VAL[0]]
        d[VAL[1]] = +d[VAL[1]]
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
        height = Math.ceil((width * slopechart_aspect_height) / slopechart_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y1 = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
            return d[VAL[0]];
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
            return d[VAL[1]];
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
            return y1(d[VAL[0]]);
        })
        .attr("y2", function (d) {
            return y2(d[VAL[1]]);
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

//slope chart for 3 ranked tuition values
function rankchart(div, id) {

    data = data_main.filter(function (d) {
        return d.abbrev != "US";
    });
    data.forEach(function (d) {
        d[VAL[0]] = +d[VAL[0]]
        d[VAL[1]] = +d[VAL[1]]
        d[VAL[2]] = +d[VAL[2]]
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
        height = Math.ceil((width * slopechart_aspect_height) / slopechart_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .domain([1, 50])
        .range([0, height]);

    var yAxis1 = d3.svg.axis()
        .scale(y)
        .orient("left");

    var gy1 = svg.append("g")
        .attr("class", "y axis-show")
        .call(yAxis1);

    var yAxis2 = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickFormat('')
        .orient("right");

    var gy2 = svg.append("g")
        .attr("class", "y axis-show")
        .attr("transform", "translate(" + width / 2 + " ,0)")
        .call(yAxis2);

    var gy3 = svg.append("g")
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
            return (i * width / 2);
        })
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return d;
        });

    svg.append("text")
        .attr("x", -55)
        .attr("y", function (d) {
            return y(3);
        })
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .text("Most expensive");

    svg.append("text")
        .attr("x", -55)
        .attr("y", function (d) {
            return y(48);
        })
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .text("Least expensive");

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
            return y(d[VAL[0]]);
        })
        .attr("y2", function (d) {
            return y(d[VAL[1]]);
        })
        .attr("x1", 0)
        .attr("x2", width / 2)
        .attr("stroke", function (d) {
            if (d.abbrev == "US") {
                return "#000";
            } else {
                return "#ccc";
            }
        });

    lines.append("g")
        .append("line")
        .attr('id', function (d) {
            return d.abbrev;
        })
        .attr("class", "chartline")
        .attr("y1", function (d) {
            return y(d[VAL[1]]);
        })
        .attr("y2", function (d) {
            return y(d[VAL[2]]);
        })
        .attr("x1", width / 2)
        .attr("x2", width)
        .attr("stroke", function (d) {
            if (d.abbrev == "US") {
                return "#000";
            } else {
                return "#ccc";
            }
        });
}

//this is really a line chart in disguise
function slopechart3(div, id) {

    data_years = data_long.filter(function (d) {
        return (d[YEARVAL] == 2005 | d[YEARVAL] == 2010 | d[YEARVAL] == 2015);
    });

    var margin = {
        top: 25,
        right: 25,
        bottom: 25,
        left: 55
    };

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * slopechart3_aspect_height) / slopechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $GRAPHDIV.empty();

    var x = d3.scale.linear()
        .range([0, width]);

    //hardcoding the domain because we want it to be the same for all graphs
    var y = d3.scale.linear()
        .domain([0, d3.max(data_years, function (d) {
            return +d.tuition_4year;
        })])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#ccc"]);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data_long[0]).filter(function (key) {
        return key == "state";
    }));

    data = data_years.map(function (d) {
        return {
            abbrev: d.abbrev,
            year: +d[YEARVAL],
            val: +d[LINEVAL]
        };
    });

    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));

    var yearf = d3.format("02d");

    function formatYear(d) {
        return (d-1) +"-" + yearf(d-2000);
    }

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(height)
        .tickFormat(formatYear)
        .ticks(3);

    var gx = svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    gx.selectAll("text")
        .attr("dy", 15);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat(FORMATTER)
        .outerTickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis-show")
        .call(yAxis);

    svg.append("text")
        .attr("class", "slope-label")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", -15)
        .text(LABELS);

    data_nest = d3.nest().key(function (d) {
        return d.abbrev;
    }).entries(data);

    var line = d3.svg.line()
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
                return "#000";
            } else {
                return "#ccc";
            }
        });
}