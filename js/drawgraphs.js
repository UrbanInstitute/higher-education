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
    $LEGENDDIV,
    COLORS,
    BREAKS,
    stateSelect,
    MAINMAP = 0;

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#0096d2", "#00578b"]
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

    function maplegend() {
        $LEGENDDIV = $("#legend_fte2year");
        legend("#legend_fte2year");
    }
    maplegend();
}

function grantaid1() {
    $GRAPHDIV = $("#grantaid1");
    FORMATTER = d3.format("%");
    VAL = "grants_needbased";
    splitchart_aspect_height = 1.9;
    isMobile = false;
    splitchart("#grantaid1");
}

function grantaid2() {
    $GRAPHDIV = $("#grantaid2");
    FORMATTER = d3.format("%");
    VAL = "grants_nonneedbased";
    splitchart_aspect_height = 1.9 * (16 / 34);
    isMobile = false;
    splitchart("#grantaid2");
}

function grantmap() {
    $GRAPHDIV = $("#map_grantaid");
    MAINMAP = 0;
    BREAKS = [0.5];
    COLORS = ["#fdbf11", "#1696d2"];
    VAL = "grants_pctneedbased";
    map("#map_grantaid");
}

function map_instate() {
    $GRAPHDIV = $("#map_instate");
    VAL = "res_pct_instate";
    COLORS = palette.blue5;
    BREAKS = [0.6, 0.7, 0.8, 0.9];
    isMobile = false;
    MAINMAP = 1;
    map("#map_instate");
    function maplegend() {
        $LEGENDDIV = $("#legend_instate");
        legend("#legend_instate");
        FORMATTER = d3.format("%");
    }
    maplegend();
}

function map_outstate() {
    $GRAPHDIV = $("#map_outstate");
    VAL = "state_pct_outstate";
    COLORS = palette.yellow5;
    BREAKS = [0.1, 0.2, 0.3, 0.4];
    isMobile = false;
    MAINMAP = 1;
    map("#map_outstate");
    function maplegend() {
        $LEGENDDIV = $("#legend_outstate");
        legend("#legend_outstate");
        FORMATTER = d3.format("%");
    }
    maplegend();
}

function enrollchart() {
    $GRAPHDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#enrollment");
    COLORS = palette.blue5;
    BREAKS = [0.1, 0.2, 0.3, 0.4];

    function pairedmap() {
        $GRAPHDIV = $("#map_enroll");
        VAL = "enroll0115";
        MAINMAP = 0;
        map("#map_enroll");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_enroll");
        legend("#legend_enroll");
    }
    maplegend();
}

function appropchart() {
    $GRAPHDIV = $("#appropriations");
    LINEVAL = "approp_change";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("%");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#appropriations");
    COLORS = palette.yellowblue;
    BREAKS = [-0.3, -0.15, 0, 0.15, 0.3];

    function pairedmap() {
        $GRAPHDIV = $("#map_approp");
        VAL = "approp0115";
        MAINMAP = 0;
        map("#map_approp");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_approp");
        legend("#legend_approp");
    }
    maplegend();
}

function approp_percapchart() {
    $GRAPHDIV = $("#approp_percap");
    LINEVAL = "approp_percap";
    YEARVAL = "fiscalyear";
    FORMATTER = d3.format("$,");
    isMobile = false;
    NUMTICKS = 14;
    linechart("#approp_percap");
    COLORS = palette.yellowblue;
    BREAKS = [-0.3, -0.15, 0, 0.15, 0.3];

    function pairedmap() {
        $GRAPHDIV = $("#map_approppc");
        VAL = "approp_percap0115";
        MAINMAP = 0;
        map("#map_approppc");
    }
    pairedmap();
    
    function maplegend() {
        FORMATTER = d3.format("%");
        $LEGENDDIV = $("#legend_approppc");
        legend("#legend_approppc");
    }
    maplegend();
}

function drawgraphs() {

    fte2year();
    grantaid1();
    grantaid2();
    grantmap();
    map_instate();
    map_outstate();
    enrollchart();
    appropchart();
    approp_percapchart();

    var allbars = d3.selectAll(".bar, .chartline, .splitbar, .boundary_paired");
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