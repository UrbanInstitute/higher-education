var barchart_aspect_width = 1;
var barchart_aspect_height = 0.4;

function barchart(div, id) {

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data = data_bins;
    var margin = {
        top: 5,
        right: 5,
        bottom: 25,
        left: 35
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {
        barchart_aspect_height = 1;
    }

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * barchart_aspect_height) / barchart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $GRAPHDIV.empty();

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) {
        return a.ftepubin2year - b.ftepubin2year;
    });

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
        return d.ftepubin2year;
    });

    if (ymin >= 0) {
        y.domain([0, d3.max(data, function (d) {
            return d.ftepubin2year;
        })]);
    } else {
        y.domain(d3.extent(data, function (d) {
            return d.ftepubin2year;
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
        .attr("class", "x axis")
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

    var pctbar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    pctbar.append("rect")
        .attr('id', function (d) {
            return "v" + d.abbrev;
        })
        .attr("fill", function (d) {
            return color(d.ftepubin2year);
        })
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.abbrev);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return Math.min(y(d.ftepubin2year), y(0));
        })
        .attr("height", function (d) {
            return Math.abs(y(0) - (y(d.ftepubin2year)));
        });

    function type(d) {
        d.ftepubin2year = +d.ftepubin2year;
        return d;
    }

}