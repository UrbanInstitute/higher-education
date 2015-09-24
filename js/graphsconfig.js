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
    MAINMAP = 0,
    height_multiplier;

var formatpct = d3.format("%");
var formatnum = d3.format(",.0f");
var formatmoney = d3.format("$,.0f");
var formatdollars = d3.format("$,.2f");
var formatfunding = d3.format("$,.3s");

var palette = {
    blue5: ["#b0d5f1", "#82c4e9", "#1696d2", "#00578b", "#00152A"],
    yellow5: ["#fff2cf", "#fdd870", "#fdbf11", "#e88e2d", "#ca5800"],
    yellowblue: ["#ca5800", "#fcb918", "#ffedcd", "#d7e8f6", "#1696d2", "#00578b"],
    gray5: ["#ECECEC", "#DCDBDB", "#ccc", "#777", "#000"]
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

var dispatch = d3.dispatch("load", "statechange", "hoverState", "dehoverState", "clickState");
var menuId;
var selecter = d3.selectAll(".stateselect")

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
        this.parentNode.parentNode.appendChild(this.parentNode);
    });
};

dispatch.on("load.menu", function (stateById) {
    //populate the dropdowns using main csv's state names & abbreviations
    selecter.on("change", function () {
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
});

//tooltip function is defined in each [content]graphs.js
//on change of the dropdown, unselect all graph components and then select ones with id = dropdown value, make tooltip state be dropdown value
dispatch.on("statechange.menu", function (statebyId) {
    selecter.property("value", statebyId.abbrev);
    d3.selectAll(".bar, .chartline, .labelline, .splitbar, .boundary_paired, .rankbar, .ranktext, .scatterdot").classed("selected", false);
    menuId = statebyId.abbrev;
    d3.selectAll("[id='" + menuId + "']")
        .classed("selected", true)
        .moveToFront();
    tooltip(menuId);
});

//select a state by clicking on the graph/map element. change tooltip and dropdowns too
dispatch.on("clickState", function (statebyId) {
    selecter.property("value", statebyId);
    d3.selectAll(".bar, .chartline, .labelline, .splitbar, .boundary_paired, .rankbar, .ranktext, .scatterdot").classed("selected", false);
    d3.selectAll("[id='" + statebyId + "']")
        .classed("selected", true)
        .moveToFront();
    tooltip(statebyId);
});


//on hover, class those states "hovered" (turn em pink) and change the tooltip
dispatch.on("hoverState", function (statebyId) {
    d3.selectAll("[id='" + statebyId + "']")
        .classed("hovered", true)
        .moveToFront();
    tooltip(statebyId);
});

//declass "hovered" and return tooltip back to value in dropdowns
dispatch.on("dehoverState", function (statebyId) {
    d3.selectAll("[id='" + statebyId + "']").classed("hovered", false);
    menuId = selecter.property("value");
    tooltip(menuId);
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
                    tooltip("US");
                    drawgraphs();
                    window.onresize = drawgraphs;
                });
            });
        });
    }
});