var us,
    map_aspect_width = 1,
    map_aspect_height = 0.7;

d3.helper = {};
d3.helper.tooltip = function (accessor) {
    return function (selection) {
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function (d, i) {
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div').attr('class', 'urban-map-tooltip');
                var absoluteMousePos = d3.mouse(bodyNode);
                if ((absoluteMousePos[0] - 150) < 100) {
                    tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                        .style('top', (absoluteMousePos[1] - 90) + 'px')
                        .style('position', 'absolute')
                        .style('z-index', 1001);
                } else {
                    tooltipDiv.style('left', (absoluteMousePos[0] - 150) + 'px')
                        .style('top', (absoluteMousePos[1] - 90) + 'px')
                        .style('position', 'absolute')
                        .style('z-index', 1001);
                }
                // Add text using the accessor function
                var tooltipText = accessor(d, i) || '';
            })
            .on('mousemove', function (d, i) {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                if ((absoluteMousePos[0] - 150) < 100) {
                    tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                        .style('top', (absoluteMousePos[1] - 90) + 'px');
                } else {
                    tooltipDiv.style('left', (absoluteMousePos[0] - 150) + 'px')
                        .style('top', (absoluteMousePos[1] - 90) + 'px');
                }
                var tooltipText = accessor(d, i) || '';
                tooltipDiv.html(tooltipText);
            })
            .on("mouseout", function (d, i) {
                tooltipDiv.remove();
            });
    };
};

//map of value estimate
function map(div, id) {

    var margin = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {}


    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * map_aspect_height) / map_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    var projection = d3.geo.albersUsa()
        .scale(width * 1.3)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    if (MAINMAP == 1) {
        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function (d) {
                return d.properties.abbrev;
            })
            .attr("class", "boundary")
            .attr("fill", function (d) {
                return color(d.properties[VAL]);
            })
            .call(d3.helper.tooltip(
                function (d, i) {
                    return "<b>" + d.properties.name + "</b></br>Share of college-going high school graduates who enroll in-state: " + d3.format("%")(d.properties.res_pct_instate) + "</br>Share of first-time college students who are from another state: " + d3.format("%")(d.properties.state_pct_outstate);
                }
            ));
    } else {
        svg.selectAll("path")
            .data(topojson.feature(us, us.objects.cb_2014_us_state_20m).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function (d) {
                return d.properties.abbrev;
            })
            .attr("class", "boundary_paired")
            .attr("fill", function (d) {
                //NH doesn't give grant aid
                if (VAL == "grants_pctneedbased" & d.properties.abbrev == "NH") {
                    return "#ccc";
                } else {
                    return color(d.properties[VAL]);
                }
            });
    }

}

function legend(div) {

    var margin = {
        top: 3,
        right: 1,
        bottom: 2,
        left: 1
    };

    var width = $LEGENDDIV.width() - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    $LEGENDDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lp_w = 0,
        ls_w = (width / COLORS.length),
        ls_h = 15;

    var legend = svg.selectAll("g.legend")
        .data(COLORS)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("text")
        .data(BREAKS)
        .attr("x", function (d, i) {
            return (i * ls_w) + lp_w + ls_w - 2;
        })
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(function (d, i) {
            return FORMATTER(d);
        });

    legend.append("rect")
        .data(COLORS)
        .attr("x", function (d, i) {
            return (i * ls_w) + lp_w;
        })
        .attr("y", 20)
        .attr("width", ls_w - 3)
        .attr("height", ls_h)
        .style("fill", function (d, i) {
            return COLORS[i];
        })
}

function catlegend(div) {

    var margin = {
        top: 3,
        right: 1,
        bottom: 5,
        left: 1
    };

    var width = $LEGENDDIV.width() - margin.left - margin.right,
        height = 30 - margin.top - margin.bottom;

    $LEGENDDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lp_w = 130,
        ls_w = 30,
        ls_h = 15;

    var legend = svg.selectAll("g.legend")
        .data(LABELS)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("text")
        .data(LABELS)
        .attr("x", function (d, i) {
            return (i * (ls_w + lp_w)) + ls_w + 5;
        })
        .attr("y", 22)
        .text(function (d, i) {
            return d;
        });

    legend.append("rect")
        .data(COLORS)
        .attr("x", function (d, i) {
            return (i * (ls_w + lp_w));
        })
        .attr("y", 10)
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function (d, i) {
            return COLORS[i];
        })

    //manual dashed line
    legend.append("line")
        .attr("x1", function (d, i) {
            return (2 * (ls_w + lp_w));
        })
        .attr("x2", function (d, i) {
            return (2 * (ls_w + lp_w)) + ls_w;
        })
        .attr("y1", 18)
        .attr("y2", 18)
        .attr("class", "labelline");

}