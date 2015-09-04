var barchart_aspect_width = 1;
var barchart_aspect_height = 0.7;

function barchart(div, id) {

    var color = d3.scale.threshold()
        .domain(BREAKS)
        .range(COLORS);

    data = data_main.filter(function (d) {
        return d.abbrev != "US";
    });

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

    if (isMobile) {}

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
        return a[VAL] - b[VAL];
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
        });

    //US value
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

}