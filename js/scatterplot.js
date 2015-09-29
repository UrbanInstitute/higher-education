var scatterplot_aspect_height = 2;

function scatterplot(div, id) {

    data = data_main.filter(function (d) {
        return d.abbrev != "US";
    });

    data.forEach(function (d) {
        d[VAL[0]] = +d[VAL[0]];
        d[VAL[1]] = +d[VAL[1]];
        d.t4outstate_15 = +d.t4outstate_15;
    });
    var margin = {
        top: 30,
        right: 10,
        bottom: 50,
        left: 70
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * scatterplot_aspect_height) / ranking_aspect_width) - margin.top - margin.bottom;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.t4outstate_15;
        })])
        .range([height, 0]);

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d[VAL[0]];
        })])
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .outerTickSize(0)
        .tickFormat(FORMATTER)
        .orient("bottom")
        .ticks(6);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis-show")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(y)
        .outerTickSize(0)
        .tickFormat(FORMATTER)
        .orient("left")
        .ticks(6);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "slope-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 35)
        .text(LABELS[0]);

    svg.append("text")
        .attr("class", "slope-label")
        .attr("text-anchor", "start")
        .attr("x", -36)
        .attr("y", -10)
        .text(LABELS[1]);

    //us lines

    usdata = data_main.filter(function (d) {
        return d.abbrev == "US";
    });
    var lines = svg.selectAll(".state")
        .data(usdata)
        .enter()
        .append("g");

    lines.append("line")
        .attr("class", "labelline")
        .attr("y1", height)
        .attr("y2", 0)
        .attr("x1", function (d) {
            return x(d[VAL[0]]);
        })
        .attr("x2", function (d) {
            return x(d[VAL[0]]);
        });

    lines.append("line")
        .attr("class", "labelline")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", function (d) {
            return y(d[VAL[1]]);
        })
        .attr("y2", function (d) {
            return y(d[VAL[1]]);
        });

    lines.append("text")
        .attr("y", -10)
        .attr("x", function (d) {
            return x(d[VAL[0]]);
        })
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .text("US average");

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "scatterdot")
        .attr("id", function (d) {
            return d.abbrev;
        })
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return x(d[VAL[0]]);
        })
        .attr("cy", function (d) {
            return y(d[VAL[1]]);
        })
        .attr("fill", "#ccc")
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
                console.log("I'm using the worst browser test4");
            } else {
                dispatch.hoverState(this.id);
            }
        })
        .on("mouseout", function (d) {
            dispatch.dehoverState(this.id);
        });
}