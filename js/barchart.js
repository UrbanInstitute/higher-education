var barchart_aspect_width = 1;


function barchart(div, id) {

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data = data_main.filter(function (d) {
        return d.abbrev != "US";
    });

    data.sort(function (a, b) {
        return a[VAL] - b[VAL];
    });

    //vertical bar chart on mobile
    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        var barchart_aspect_height = 2.4;
        var margin = {
            top: 25,
            right: 15,
            bottom: 25,
            left: 25
        };

        var width = $GRAPHDIV.width() - margin.left - margin.right,
            height = Math.ceil((width * barchart_aspect_height) / barchart_aspect_width) - margin.top - margin.bottom;

        $GRAPHDIV.empty();

        var svg = d3.select(div).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .2)
            .domain(data.map(function (d) {
                return d.abbrev;
            }));

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d[VAL];
            })]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .orient("left");

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(height)
            .tickFormat(FORMATTER)
            .ticks(numticks / 2)
            .orient("top");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var gx = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis")
            .call(xAxis);

        gx.selectAll("g").filter(function (d) {
                return d;
            })
            .classed("minor", true);

        //US average as line for comparison
        svg.append("g")
            .append("line")
            .attr("id", "US")
            .attr("class", "labelline")
            .attr("x1", function (d) {
                return x(0.459912672);
            })
            .attr("x2", function (d) {
                return x(0.459912672);
            })
            .attr("y1", 0)
            .attr("y2", height);

        svg.append("text")
            .attr("y", -5)
            .attr("x", function (d) {
                return x(0.459912672);
            })
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .text("US");

        var pctbar = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");

        //non-need-based on right
        pctbar.append("rect")
            .attr('id', function (d) {
                return d.abbrev;
            })
            .attr("fill", function (d) {
                return color(d[VAL]);
            })
            .attr("class", "bar")
            .attr("x", function (d) {
                return Math.min(x(d[VAL]), x(0));
            })
            .attr("width", function (d) {
                return Math.abs(x(0) - (x(d[VAL])));
            })
            .attr("y", function (d) {
                return y(d.abbrev);
            })
            .attr("height", y.rangeBand())
            .on("click", function (d) {
                dispatch.clickState(this.id);
            })
            .on("mouseover", function (d) {
                dispatch.hoverState(this.id);
            })
            .on("mouseout", function (d) {
                dispatch.dehoverState(this.id);
            });

    } else {
        var barchart_aspect_height = 0.7;
        var margin = {
            top: 5,
            right: 5,
            bottom: 25,
            left: 35
        };

        var width = $GRAPHDIV.width() - margin.left - margin.right,
            height = Math.ceil((width * barchart_aspect_height) / barchart_aspect_width) - margin.top - margin.bottom;

        $GRAPHDIV.empty();

        var svg = d3.select(div).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(data.map(function (d) {
                return d.abbrev;
            }));

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .orient("bottom");

        var y = d3.scale.linear()
            .range([height, 0]);

        var ymin = d3.min(data, function (d) {
            return d[VAL];
        });

        if (ymin >= 0) {
            y.domain([0, d3.max(data, function (d) {
                return d[VAL];
            })]);
        } else {
            y.domain(d3.extent(data, function (d) {
                return d[VAL];
            }));
        }

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(FORMATTER)
            .ticks(numticks)
            .tickSize(-width);

        var gx = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis abbrevs")
            .call(xAxis);

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        gy.selectAll("g").filter(function (d) {
                return d;
            })
            .classed("minor", true);

        gy.selectAll("text")
            .attr("x", -4)
            .attr("dy", 4);

        //US average as line for comparison
        svg.append("g")
            .append("line")
            .attr("id", "US")
            .attr("class", "labelline")
            .attr("y1", function (d) {
                return y(0.459912672);
            })
            .attr("y2", function (d) {
                return y(0.459912672);
            })
            .attr("x1", 0)
            .attr("x2", width);

        svg.append("text")
            .attr("x", -15)
            .attr("y", function (d) {
                return y(0.459912672) + 4;
            })
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .text("US");

        var pctbar = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g");

        pctbar.append("rect")
            .attr('id', function (d) {
                return d.abbrev;
            })
            .attr("fill", function (d) {
                return color(d[VAL]);
            })
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.abbrev);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return Math.min(y(d[VAL]), y(0));
            })
            .attr("height", function (d) {
                return Math.abs(y(0) - (y(d[VAL])));
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
                    this.parentNode.appendChild(this);
                    console.log("I'm using the worst browser test3");
                } else {
                    dispatch.hoverState(this.id);
                }
            })
            .on("mouseout", function (d) {
//                if (isIE != false) {
//                    d3.selectAll(".bar#" + this.id)
//                        .attr("fill", function (d) {
//                            return color(d[VAL]);
//                        })
//                }
                dispatch.dehoverState(this.id);
            });
    }
}