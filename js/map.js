var us,
    map_aspect_width = 1,
    map_aspect_height = 0.7;

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
                return "#fff";
            } else {
                return color(d.properties[VAL]);
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
                //.moveToFront();
                tooltip(this.id);
                //this.parentNode.appendChild(this);

            } else {
                dispatch.hoverState(this.id);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(this.id);
        })
        .on("mouseleave", function (d) {
            if (isIE != false) {
                d3.selectAll(".hovered")
                    .classed("hovered", false);
                menuId = selecter.property("value");
                tooltip(menuId);
                d3.selectAll("[id='" + menuId + "']")
                    .moveToFront();
            }
        });
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

    if ($LEGENDDIV.width() < 500) {
        var lp_w = 0,
            ls_w = (width / COLORS.length),
            ls_h = 15;
    } else {
        var lp_w = 0,
            ls_w = 60,
            ls_h = 15;
    }

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