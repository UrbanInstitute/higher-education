var MOBILE_THRESHOLD = 600;
//configure in each graph call
var BREAKS,
    FORMATTER,
    BINVAL,
    $BINDIV;

//globals
var data;
var bingraph_data_url = "data/statedata.csv";
var bingraph_aspect_width = 1,
    bingraph_aspect_height = 0.4;

var isMobile = false;
var binnedData;

//make array of the states in each bin
function formatData() {
    var numBins = BREAKS.length - 1;

    // init the bins
    for (var i = 0; i < numBins; i++) {
        binnedData[i] = [];
    }

    // put states in bins
    _.each(data, function (d) {
        if (d[BINVAL] != null) {
            var amt = +d[BINVAL];
            var abbrev = d['abbrev'];

            for (var i = 0; i < numBins; i++) {
                if (amt >= BREAKS[i] && amt <= BREAKS[i + 1]) {
                    binnedData[i].unshift(abbrev);
                    break;
                }
            }
        }
    });
    console.log(binnedData);
}

function bingraph(div, id) {

    var blockGap = 1;

    if ($BINDIV.width() < MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var margin = {
        top: 30,
        right: 10,
        bottom: 25,
        left: 10
    };

    // Determine largest bin
    var largestBin = _.max(binnedData, function (bin) {
        return bin.length;
    }).length;
    
    if (isMobile) {
        bingraph_aspect_height = 0.8;
    }

    var width = $BINDIV.width() - margin.left - margin.right,
        height = Math.ceil((width * bingraph_aspect_height) / bingraph_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    var blockHeight = height / largestBin;

    $BINDIV.empty();

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

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);
    
    //have to manually attach last value
    gx.append("text")
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 6)
        .attr("class", "tick")
        .text(function () {
            return FORMATTER(BREAKS[BREAKS.length - 1]);
        })
        .attr('transform', function (d, i) {
            return "translate(" + (((BREAKS.length -1)* 1.1 * x.rangeBand()) + (x.rangeBand()*0.55))+ "," + 9 + ")";
        });

    gx.selectAll("text")
        .attr("dx", -0.55 * x.rangeBand())
        .attr("y", 6);


    var bins = svg.selectAll('.bin')
        .data(binnedData)
        .enter().append('g')
        .attr('transform', function (d, i) {
            return "translate(" + x(BREAKS[i]) + ",0 )";
        });

    //draw bins
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
        .attr("class", "bin")
        .attr("id", function (d) {
            return d['value'];
        })
        .attr('height', blockHeight)
        .attr('fill', "#a2d4ec");

    //label bins with state abbreviation
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