//acts as if the left (need-based) is a negative value for construction purposes
var splitchart_aspect_width = 1;
var splitchart_aspect_height = 1.3;

function splitchart(div, id) {

    //separating out the data into 2 graphs based on more/less need based

    data = data_main.filter(function (d) {
        return d.abbrev != "US" & (d[VAL] / d.grants_perfte >= 0.5);
    });

    var margin = {
        top: 35,
        right: 5,
        bottom: 25,
        left: 85
    };

    if ($GRAPHDIV.width() <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (isMobile) {}

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * splitchart_aspect_height) / splitchart_aspect_width) - margin.top - margin.bottom,
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

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .2)
        .domain(data.map(function (d) {
            return d.state;
        }));

    var x = d3.scale.linear()
        .range([0, width])
        .domain([-1600, 1600]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient("left");

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(height)
        .ticks(3)
        .tickFormat(function (d) {
            if (d < 0) d = -d;
            return d3.format("$,")(d);
        })
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

    var pctbar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    //need-based on left
    pctbar.append("rect")
        .attr('id', function (d) {
            return d.abbrev;
        })
        .attr("class", "splitbar needbased")
        .attr("x", function (d) {
            return x(-1 * d.grants_needbased);
        })
        .attr("width", function (d) {
            return (x(d.grants_needbased) - x(0));
        })
        .attr("y", function (d) {
            return y(d.state);
        })
        .attr("height", y.rangeBand());

    //non-need-based on right
    pctbar.append("rect")
        .attr('id', function (d) {
            return d.abbrev;
        })
        .attr("class", "splitbar nonneedbased")
        .attr("x", function (d) {
            return x(0);
        })
        .attr("width", function (d) {
            return (x(d.grants_nonneedbased) - x(0));
        })
        .attr("y", function (d) {
            return y(d.state);
        })
        .attr("height", y.rangeBand());

}