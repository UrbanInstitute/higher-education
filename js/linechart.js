var linechart_aspect_width = 1;
var linechart_aspect_height = 0.7;

var yearf = d3.format("02d");

function formatYear(d) {
    return "'" + yearf(Math.abs(2000 - d) - 1);
}

function linechart(div, id) {
    var margin = {
        top: 25,
        right: 15,
        bottom: 45,
        left: 55
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
        NUMTICKS = 7;
        linechart_aspect_height = 1;
    } else {
        isMobile = false;
        linechart_aspect_height = 0.7;
    }

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $GRAPHDIV.empty();

    var x = d3.scale.linear()
        .range([0, width]);

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

    data = data2.map(function (d) {
        return {
            abbrev: d.abbrev,
            year: +d[YEARVAL],
            val: +d[LINEVAL]
        };
    });


    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));

    //if positive/negative values, use full extent for y domain. if all positive, use 0 to max
    var ymin = d3.min(data, function (d) {
        return d.val;
    });

    if (ymin >= 0) {
        y.domain([0, d3.max(data, function (d) {
            return d.val;
        })]);
    } else {
        y.domain(d3.extent(data, function (d) {
            return d.val;
        }));
    }

    if (isMobile == false) {
        //highlight recession
        var recession = svg.append("rect")
            .attr("x", function (d) {
                return x(2008);
            })
            .attr("y", 0)
            .attr("width", function (d) {
                return x(2012) - x(2008);
            })
            .attr("height", height)
            .attr("class", "recession");

        svg.append("text")
            .attr("x", function (d) {
                return x(2008.2);
            })
            .attr("y", 15)
            .attr("text-anchor", "start")
            .attr("class", "recession-label")
            .text("Downturn");
    }

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("text")
        .attr("x", 0)
        .attr("y", height + 30)
        .attr("text-anchor", "start")
        .attr("class", "axis")
        .text("Fall");

    var yAxis = d3.svg.axis()
        .scale(y)
        .outerTickSize(0)
        .tickFormat(FORMATTER)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

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
        })
        .on("click", function (d) {
            dispatch.clickState(this.id);
        })
        .on("mouseover", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                d3.selectAll("#" + this.id)
                    .classed("hovered", true);
                tooltip(this.id);
            } else {
                dispatch.hoverState(this.id);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(this.id);
        })
        .on("mouseleave", function (d) {
            if (isIE != false) {
                svg.selectAll(".state")
                    .attr("class", "chartline")
                menuId = selecter.property("value");
                tooltip(menuId);
                d3.selectAll("[id='" + menuId + "']")
                    .moveToFront();
            }
        });

    //manual line for axis at 0
    svg.append("g")
        .append("line")
        .attr("class", "zeroline")
        .attr("y1", function (d) {
            return y(0);
        })
        .attr("y2", function (d) {
            return y(0);
        })
        .attr("x1", 0)
        .attr("x2", width);

}