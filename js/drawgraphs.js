//page globals
var MOBILE_THRESHOLD = 600;
var main_data_url = "data/statedata.csv";
var annual_data_url = "data/annualdata.csv";
var isMobile = false;
var data_long, data;
var FORMATTER,
    $LINEDIV,
    LINEVAL,
    YEARVAL,
    NUMTICKS;

//one function for each graph to make
//line charts
function enrollchart() {
    $LINEDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    YEARVAL = "fiscalyear";
    isMobile = false;
    NUMTICKS = 14;
    linechart("#enrollment");
}

function appropchart() {
    $LINEDIV = $("#appropriations");
    LINEVAL = "approp_change";
    YEARVAL = "fiscalyear";
    isMobile = false;
    NUMTICKS = 14;
    linechart("#appropriations");
}

function drawgraphs() {
    enrollchart();
    appropchart();

    var allbars = d3.selectAll(".bin, .chartline");
    allbars.on("mouseover", function () {
        var moused_id = this.id;
        allbars.classed("selected", function () {
            return this.id === moused_id;
        });
    })

    allbars.on("mouseout", function () {
        allbars.classed("selected", false);
    })
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (error, rates) {
            d3.csv(annual_data_url, function (annualrates) {
                data_long = annualrates;
                data_bins = rates;

                drawgraphs();
                window.onresize = drawgraphs;
            });
        });
    }
});