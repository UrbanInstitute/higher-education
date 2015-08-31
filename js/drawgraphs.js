//page globals
var MOBILE_THRESHOLD = 600;
var main_data_url = "data/statedata.csv";
var annual_data_url = "data/annualdata.csv";
var map_data_url = "data/states.json";
var isMobile = false;
var data_long, data;
var FORMATTER,
    VAL,
    LINEVAL,
    YEARVAL,
    NUMTICKS,
    $GRAPHDIV,
    COLORS,
    BREAKS,
    stateSelect,
    MAINMAP = 0;

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: []
};

//one function for each graph to make

function fte2year() {
    $GRAPHDIV = $("#fte2year");
    FORMATTER = d3.format("%");
    VAL = "ftepubin2year";
    numticks = 6;
    BREAKS = [0.2, 0.3, 0.4, 0.5];
    COLORS = palette.blue5;
    isMobile = false;
    barchart("#fte2year");

    function pairedmap() {
        $GRAPHDIV = $("#map_fte2year");
        MAINMAP = 0;
        map("#map_fte2year");
    }
    pairedmap();
}

function grantaid1() {
    $GRAPHDIV = $("#grantaid1");
    FORMATTER = d3.format("%");
    VAL = "grants_needbased";
    isMobile = false;
    splitchart("#grantaid1");
}

function grantaid2() {
    $GRAPHDIV = $("#grantaid2");
    FORMATTER = d3.format("%");
    VAL = "grants_nonneedbased";
    isMobile = false;
    splitchart("#grantaid2");
}

function map_instate() {
    $GRAPHDIV = $("#map_instate");
    VAL = "res_pct_instate";
    COLORS = palette.blue5;
    BREAKS = [0.6, 0.7, 0.8, 0.9];
    isMobile = false;
    MAINMAP = 1;
    map("#map_instate");
}

function map_outstate() {
    $GRAPHDIV = $("#map_outstate");
    VAL = "state_pct_outstate";
    COLORS = palette.yellow5;
    BREAKS = [0.1, 0.2, 0.3, 0.4];
    isMobile = false;
    MAINMAP = 1;
    map("#map_outstate");
}

function enrollchart() {
    $GRAPHDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#enrollment");
}

function appropchart() {
    $GRAPHDIV = $("#appropriations");
    LINEVAL = "approp_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#appropriations");
}

function approp_percapchart() {
    $GRAPHDIV = $("#approp_percap");
    LINEVAL = "approp_percap";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("$,");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#approp_percap");
}

function drawgraphs() {

    fte2year();
    grantaid1();
    grantaid2();
    map_instate();
    map_outstate();
    enrollchart();
    appropchart();
    approp_percapchart();

    var allbars = d3.selectAll(".bar, .chartline, .splitbar");
    allbars.on("mouseover", function () {
        var moused_id = this.id;
        allbars.classed("selected", function () {
            return this.id === moused_id;
        });
    })

    allbars.on("mouseout", function () {
        allbars.classed("selected", false);
    })

    stateSelect = d3.select("#state-select").property("value");
    console.log(stateSelect);
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (error, rates) {
            d3.csv(annual_data_url, function (annualrates) {
                d3.json(map_data_url, function (mapdata) {
                    data_long = annualrates;
                    data_main = rates;
                    us = mapdata;

                    drawgraphs();
                    window.onresize = drawgraphs;
                });
            });
        });
    }
});