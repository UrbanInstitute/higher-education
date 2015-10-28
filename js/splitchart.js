//left and right bar chart, split into 2 graphs based on state's % need based
//acts as if the left (need-based) is a negative value for construction purposes
var splitchart_aspect_width = 1;
splitchart_aspect_height = 1.9;

function splitchart(div, id) {

    //separating out the data into 2 graphs based on more/less need based

    data = data_main.filter(function (d) {
        return d.abbrev != "US" & (d[VAL] / d.grants_perfte >= 0.5);
    });

    var margin = {
        top: 15,
        right: 5,
        bottom: 25,
        left: 85
    };

    if ($GRAPHDIV.width() <= 350) {
        isMobile = true;
        splitchart_aspect_height = 2.2;

    } else {
        isMobile = false;
        splitchart_aspect_height = 1.9;

    }

    if (isMobile) {}

    var width = $GRAPHDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * splitchart_aspect_height * height_multiplier) / splitchart_aspect_width) - margin.top - margin.bottom;

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

    //US averages as lines for comparison, behind bars
    var usline = svg.selectAll("g.usline")
        .data([-534, 173])
        .enter().append("g");

    usline.append("line")
        .data([-534, 173])
        .attr("class", "labelline")
        .attr("x1", function (d) {
            return x(d);
        })
        .attr("x2", function (d) {
            return x(d);
        })
        .attr("y1", 0)
        .attr("y2", height)
        .attr("id", "US");

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
        .attr("height", y.rangeBand())
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
                svg.selectAll(".splitbar.needbased")
                    .attr("class", "splitbar needbased")
                menuId = selecter.property("value");
                tooltip(menuId);
                d3.selectAll("[id='" + menuId + "']")
                    .moveToFront();
            }
        });

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
        .attr("height", y.rangeBand())
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
                svg.selectAll(".splitbar.nonneedbased")
                    .attr("class", "splitbar nonneedbased")
                menuId = selecter.property("value");
                tooltip(menuId);
                d3.selectAll("[id='" + menuId + "']")
                    .moveToFront();
            }
        });
}