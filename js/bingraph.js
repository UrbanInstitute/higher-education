//configure
var COLORS = ["#CFE8F3", "#73BFE2", "#1696D2", "#12719E", "#062635"];
var MOBILE_THRESHOLD = 600;
var BREAKS = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000];
var FORMATTER = d3.format("$,");

//globals
var data;
var bingraph_data_url = "data/statedata.csv";
var bingraph_aspect_width = 1,
    bingraph_aspect_height = 0.5;
var $bingraph = $('#bingraph');

var isMobile = false;
var formatter = d3.format("%");
var binnedData = [];

/*
 * Format graphic data for processing by D3.
 */
var formatData = function () {
    var numBins = BREAKS.length - 1;

    // init the bins
    for (var i = 0; i < numBins; i++) {
        binnedData[i] = [];
    }

    // put states in bins
    _.each(data, function (d) {
        if (d['fundingfte'] != null) {
            var amt = +d['fundingfte'];
            var abbrev = d['abbrev'];

            for (var i = 0; i < numBins; i++) {
                if (amt >= BREAKS[i] && amt < BREAKS[i + 1]) {
                    binnedData[i].unshift(abbrev);
                    break;
                }
            }
        }
    });
    console.log(binnedData, numBins);
}


function bingraph() {
    var blockGap = 1;

    var margin = {
        top: 20,
        right: 15,
        bottom: 25,
        left: 15
    };

    // Determine largest bin
    var largestBin = _.max(binnedData, function (bin) {
        return bin.length;
    }).length;

    var width = $bingraph.width() - margin.left - margin.right,
        height = Math.ceil((width * bingraph_aspect_height) / bingraph_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    var blockHeight = height / largestBin;

    $bingraph.empty();


    if (width <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var formatAxis = d3.format('.0f');

    var x = d3.scale.ordinal()
        .domain(BREAKS.slice(0, -1))
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, largestBin])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(0)
        .tickFormat(FORMATTER);


    var svg = d3.select("#bingraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    svg.selectAll("text")
        .attr("dx", -x.rangeBand() / 2 - x.rangeBand() * 0.05)
        .attr("y", 6);

    /*
     * Render bins to chart.
     */
    var bins = svg.selectAll('.bin')
        .data(binnedData)
        .enter().append('g')
        .attr('transform', function (d, i) {
            return "translate(" + x(BREAKS[i]) + ",0 )";
        });


    bins.selectAll('rect')
        .data(function (d) {
            return d3.entries(d);
        })
        .enter().append('rect')
        .attr('width', x.rangeBand())
        .attr('x', 0)
        .attr('y', function (d, i) {
            return height - ((blockHeight + blockGap) * (i + 1));
        })
        .attr('height', blockHeight)
        .attr('fill', "#a2d4ec");


    /*
     * Render bin values.
     */
    bins.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(function (d) {
            return d3.entries(d);
        })
        .enter().append('text')
        .attr('x', (0.5 * x.rangeBand() - 6))
        .attr('y', function (d, i) {
            return height - ((blockHeight + blockGap) * (i + 1));
        })
        .attr('dy', (blockHeight / 2) + 4)
        .text(function (d) {
            return d['value'];
        });



}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(bingraph_data_url, function (error, rates) {
            data = rates;

            formatData();

            bingraph();

            window.onresize = bingraph;
        });
    }
});