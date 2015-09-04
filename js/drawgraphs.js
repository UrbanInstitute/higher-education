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
    LABELS,
    stateSelect,
    MAINMAP = 0;

var formatpct = d3.format("%");
var formatnum = d3.format(",.0f");
var formatmoney = d3.format("$,.0f");
var formatdollars = d3.format("$,.2f");
var formatfunding = d3.format("$,.3s");

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#0096d2", "#00578b"]
};

// Override d3's formatPrefix function - billions label as G, not B with d3 defaults
var d3_formatPrefixes = ["e-24", "e-21", "e-18", "e-15", "e-12", "e-9", "e-6", "e-3", "", "K", "M", "B", "T", "P", "E", "Z", "Y"].map(d3_formatPrefix);

d3.formatPrefix = function (value, precision) {
    var i = 0;
    if (value) {
        if (value < 0) {
            value *= -1;
        }
        if (precision) {
            value = d3.round(value, d3_format_precision(value, precision));
        }
        i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
        i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
};

function d3_formatPrefix(d, i) {
    var k = Math.pow(10, Math.abs(8 - i) * 3);
    return {
        scale: i > 8 ? function (d) {
            return d / k;
        } : function (d) {
            return d * k;
        },
        symbol: d
    };
}

function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
}

//one function for each graph & paired map/legend

function tuition15() {
    //slope chart eventually!
    COLORS = palette.blue5;
    BREAKS = [7000, 8000, 9000, 10000]
    FORMATTER = formatmoney;
    isMobile = false;

    function pairedmap() {
        $GRAPHDIV = $("#map_tuition15");
        VAL = "t4_15";
        MAINMAP = 0;
        map("#map_tuition15");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_tuition15");
        legend("#legend_tuition15");
    }
    maplegend();
}

function tuitiontime() {
    FORMATTER = formatmoney;
    YEARVAL = "fiscalyear";

    function twoyear() {
        $GRAPHDIV = $("#tuition2year");
        LABELS = "In-state 2-year tuition";
        LINEVAL = "tuition_2year";
        slopechart3("#tuition2year");
    };
    twoyear();

    function fouryear() {
        $GRAPHDIV = $("#tuition4year");
        LABELS = "In-state 4-year tuition";
        LINEVAL = "tuition_4year";
        slopechart3("#tuition4year");
    };
    fouryear();
    COLORS = palette.blue5;
    BREAKS = [0.2, 0.4, 0.6, 0.8]

    function pairedmap() {
        $GRAPHDIV = $("#map_tuitiontime");
        VAL = "t4_0515";
        MAINMAP = 0;
        map("#map_tuitiontime");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_tuitiontime");
        FORMATTER = formatpct;
        legend("#legend_tuitiontime");
    }
    maplegend();
}

function fte2year() {
    $GRAPHDIV = $("#fte2year");
    FORMATTER = formatpct;
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
    FORMATTER = formatpct;
    VAL = "grants_needbased";
    splitchart_aspect_height = 1.9;
    isMobile = false;
    splitchart("#grantaid1");
}

function grantaid2() {
    $GRAPHDIV = $("#grantaid2");
    FORMATTER = formatpct;
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
    LABELS = ["More need-based", "Less need-based"];
    VAL = "grants_pctneedbased";
    map("#map_grantaid");

    function maplegend() {
        $LEGENDDIV = $("#legend_grantaid");
        catlegend("#legend_grantaid");
    }
    maplegend();
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
        FORMATTER = formatpct;
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
        FORMATTER = formatpct;
    }
    maplegend();
}

function enrollchart() {
    $GRAPHDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    YEARVAL = "fiscalyear";
    FORMATTER = formatpct;
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

function fundingchart() {
    $GRAPHDIV = $("#funding_slope");
    VAL = ["approp_percap15", "fundingperthousinc"];
    LABELS = ["Funding per FTE student", "Funding per $1,000 in personal income"];
    COLORS = palette.blue5;
    BREAKS = [6000, 7000, 8000, 9000]
    FORMATTER = formatmoney;
    isMobile = false;
    slopechart("#funding_slope");

    function pairedmap() {
        $GRAPHDIV = $("#map_funding");
        VAL = "approp_percap15";
        MAINMAP = 0;
        map("#map_funding");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_funding");
        legend("#legend_funding");
    }
    maplegend();
}

function appropchart() {
    $GRAPHDIV = $("#appropriations");
    LINEVAL = "approp_change";
    YEARVAL = "fiscalyear";
    FORMATTER = formatpct;
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
    FORMATTER = formatmoney;
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
        FORMATTER = formatpct;
        $LEGENDDIV = $("#legend_approppc");
        legend("#legend_approppc");
    }
    maplegend();
}

function drawgraphs() {
    tuition15();
    tuitiontime();
    fte2year();
    grantaid1();
    grantaid2();
    grantmap();
    map_instate();
    map_outstate();
    enrollchart();
    fundingchart();
    appropchart();
    approp_percapchart();

    d3.selectAll("[id='US']")
        .classed("selected", true);


    //        var allbars = d3.selectAll(".bar, .chartline, .splitbar, .boundary_paired");
    //        allbars.on("mouseover", function () {
    //            var moused_id = this.id;
    //            allbars.classed("selected", function () {
    //                return this.id === moused_id;
    //            });
    //        })
    //    
    //        allbars.on("mouseout", function () {
    //            allbars.classed("selected", false);
    //        })

}

var dispatch = d3.dispatch("load", "statechange");
var menu_id;

dispatch.on("load.menu", function (stateById) {

    //pass values from the main csv to html for page "tooltips" - switch values on dropdown selection
    function tooltip() {
        data = data_main;
        var row = data.filter(function (d) {
            return d.abbrev == menu_id
        });

        row.forEach(function (d) {
            d3.selectAll(".tt-name").text(d.state);
            //tuition
            d3.select("#tt_t2_05").text(formatmoney(+d.t2_05));
            d3.select("#tt_t2_15").text(formatmoney(+d.t2_15));
            d3.select("#tt_t2_0515").text(formatpct(d.t2_0515));
            d3.select("#tt_t4_05").text(formatmoney(+d.t4_05));
            d3.select("#tt_t4_15").text(formatmoney(+d.t4_15));
            d3.select("#tt_t4_0515").text(formatpct(+d.t4_0515));
            //enrollment
            d3.select("#tt_ftepubin2year").text(formatpct(+d.ftepubin2year));
            d3.select("#tt_enroll15").text(formatnum(+d.enroll_15));
            d3.select("#tt_enroll0115").text(formatpct(+d.enroll0115));
            //funding - per capita funding is used twice
            d3.selectAll(".tt_approp_percap15").text(formatmoney(+d.approp_percap15));
            d3.select("#tt_fundingperthousinc").text(formatdollars(+d.fundingperthousinc));
            d3.select("#tt_grants_needbased").text(formatmoney(+d.grants_needbased));
            d3.select("#tt_grants_nonneedbased").text(formatmoney(+d.grants_nonneedbased));
            d3.select("#tt_approp_15").text(formatfunding(+d.approp_15));
            d3.select("#tt_approp0115").text(formatpct(+d.approp0115));
            d3.select("#tt_approp_percap0115").text(formatpct(+d.approp_percap0115));
        });
    }

    //populate the dropdowns using main csv's state names & abbreviations
    var selecter = d3.selectAll(".stateselect")
        .on("change", function () {
            dispatch.statechange(stateById.get(this.value));
        });

    selecter.selectAll("option")
        .data(stateById.values())
        .enter().append("option")
        .attr("value", function (d) {
            return d.abbrev;
        })
        .text(function (d) {
            return d.state;
        });

    //on change of the dropdown, unselect all graph components and then select ones with id = dropdown value
    dispatch.on("statechange.menu", function (state) {
        selecter.property("value", state.abbrev);
        d3.selectAll(".bar, .chartline, .labelline, .splitbar, .boundary_paired").classed("selected", false);
        menu_id = state.abbrev;
        d3.selectAll("[id='" + menu_id + "']")
            .classed("selected", true);
        tooltip();
    });
});

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(main_data_url, function (error, rates) {
            d3.csv(annual_data_url, function (annualrates) {
                d3.json(map_data_url, function (mapdata) {
                    data_long = annualrates;
                    data_main = rates;
                    us = mapdata;

                    var stateById = d3.map();
                    data_main.forEach(function (d) {
                        stateById.set(d.abbrev, d);
                    });
                    dispatch.load(stateById);
                    dispatch.statechange(stateById.get("US"));

                    drawgraphs();
                    window.onresize = drawgraphs;
                });
            });
        });
    }
});