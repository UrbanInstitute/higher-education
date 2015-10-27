//selectable list of ranked tuition values - basically built as 3 bar charts

var ranking_aspect_width = 1;
var ranking_aspect_height = 1.1;
var dt;

function rankingchart(div, id) {

    data = data_main.filter(function (d) {
        return d.abbrev != "US";
    });

    var margin = {
        right: 5,
        bottom: 5,
        left: 50
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
        margin.top = 35;
    } else {
        isMobile = false;
        margin.top = 15;
    }

    var width = $GRAPHDIV.width() - margin.left - margin.right;
    var height = Math.max(678, Math.ceil((width * ranking_aspect_height) / ranking_aspect_width) - margin.top - margin.bottom);

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //common y axis labelling 1-50
    var y0 = d3.scale.ordinal()
        .domain(d3.range(1, 51))
        .rangeRoundBands([0, height], .1);

    var yAxis = d3.svg.axis()
        .scale(y0)
        .tickSize(0)
        .ticks(50)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var legend = svg.selectAll("g.legend")
        .data([0])
        .enter().append("g")
        .attr("class", "ranklegend");

    legend.append("text")
        .attr("text-anchor", "end")
        .attr("class", "legend")
        .text("Most expensive")
        .attr("transform", function (d) {
            return "translate(" + -30 + "," + y0(1) + ") rotate(-90)";
        });

    legend.append("text")
        .attr("text-anchor", "start")
        .attr("class", "legend")
        .text("Least expensive")
        .attr("transform", function (d) {
            return "translate(" + -30 + "," + (y0(50) + y0.rangeBand()) + ") rotate(-90)";
        });

    var barwidth = width / 4

    //3 lists, each with rankings of 1-50 except 1-49 for 2 year tuition
    for (i in [0, 1, 2]) {

        if (i == 0) {
            dt = data_main.filter(function (d) {
                return d.abbrev != "US" & d.abbrev != "AK";
            });
        } else {
            dt = data;
        }

        dt.sort(function (a, b) {
            return a[VAL[i]] - b[VAL[i]];
        });

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1)
            .domain(d3.range(1, 51));

        if (isMobile) {
            svg.append("text")
                .attr("x", (0.5 * barwidth) + (i * width / 3))
                .attr("y", -15)
                .attr("class", "slope-label")
                .attr("text-anchor", "middle")
                .text(LABELS1[i]);

            svg.append("text")
                .attr("x", (0.5 * barwidth) + (i * width / 3))
                .attr("y", 0)
                .attr("class", "slope-label")
                .attr("text-anchor", "middle")
                .text(LABELS2[i]);

        } else {
            svg.append("text")
                .attr("x", (0.5 * barwidth) + (i * width / 3))
                .attr("y", 0)
                .attr("class", "slope-label")
                .attr("text-anchor", "middle")
                .text(LABELS[i]);
        }

        var rankbar = svg.selectAll("g.rankbar")
            .data(dt)
            .enter()
            .append("g");

        rankbar.append("rect")
            .attr('id', function (d) {
                return d.abbrev;
            })
            .attr("class", "rankbar")
            .attr("x", i * width / 3)
            .attr("width", barwidth)
            .attr("y", function (d) {
                return y(d[VAL[i]]);
            })
            .attr("height", y.rangeBand())
            .on("mouseover", function (d) {
                if (isIE == false) {
                    dispatch.hoverState(this.id);
                }
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(this.id);
            });

        //label bars with state name (abbreviation on mobile)
        rankbar.append("text")
            .attr('id', function (d) {
                return d.abbrev;
            })
            .attr("class", "ranktext")
            .attr("x", 0.5 * barwidth + (i * width / 3))
            .attr("text-anchor", "middle")
            .attr("y", function (d) {
                return y(d[VAL[i]]) + (y.rangeBand()) / 2 + 4;
            })
            .text(function (d, i) {
                if (isMobile) {
                    return d.abbrev;
                } else {
                    return d.state;
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
                        .classed("hovered", true)
                        .moveToFront();
                    tooltip(this.id);
                    this.parentNode.appendChild(this);
                } else {
                    if (isIE != false) {
                        d3.selectAll(".hovered")
                            .classed("hovered", false);
                    } else {
                        dispatch.hoverState(this.id);
                    }
                }
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(this.id);
            });
    }
}