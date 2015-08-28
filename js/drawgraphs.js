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
    NUMTICKS,
    $GRAPHDIV,
    COLORS,
    BREAKS;

//one function for each graph to make

function fte2year() {
    $GRAPHDIV = $("#fte2year");
    FORMATTER = d3.format("%");
    numticks = 6;
    BREAKS = [0.2, 0.3, 0.4, 0.5];
    COLORS = ["#cfe8f3", "#73bfe2", "#1696d2", "#0a4c6a", "#062635"];
    isMobile = false;
    barchart("#fte2year");
}

function enrollchart() {
    $LINEDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#enrollment");
}

function appropchart() {
    $LINEDIV = $("#appropriations");
    LINEVAL = "approp_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#appropriations");
}

function approp_percapchart() {
    $LINEDIV = $("#approp_percap");
    LINEVAL = "approp_percap";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("$,");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#approp_percap");
}


function drawgraphs() {
    fte2year();
    enrollchart();
    appropchart();
    approp_percapchart();

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