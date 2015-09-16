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
    BREAKS = [0.2, 0.4, 0.6, 0.8];
    COLORS = palette.gray5;
    VAL = "grants_pctneedbased";
    map("#map_grantaid");

    function maplegend() {
        $LEGENDDIV = $("#legend_grantaid");
        legend("#legend_grantaid");
    }
    maplegend();
}

function grantlegend() {
    $LEGENDDIV = $("#legend_grantbars");
    COLORS = ["#1696d2", "#fcb918"];
    LABELS = ["Need-based", "Non-need-based"];
    catlegend("#legend_grantbars");
}

function appropchart() {
    data2 = data_long;
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
    data2 = data_long.filter(function (d) {
        return d.fiscalyear < 2015;
    });;
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
        VAL = "approp_percap0114";
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
    fundingchart();
    grantaid1();
    grantaid2();
    grantmap();
    grantlegend();
    appropchart();
    approp_percapchart();

    d3.selectAll("[id='US']")
        .classed("selected", true);
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
            d3.select("#tt_approp_percap15").text(formatmoney(+d.approp_percap15));
            d3.select("#tt_fundingperthousinc").text(formatdollars(+d.fundingperthousinc));
            d3.select("#tt_grants_needbased").text(formatmoney(+d.grants_needbased));
            d3.select("#tt_grants_nonneedbased").text(formatmoney(+d.grants_nonneedbased));
            d3.select("#tt_approp_15").text(formatfunding(+d.approp_15));
            d3.select("#tt_approp0115").text(formatpct(+d.approp0115));
            d3.select("#tt_approp_percap14").text(formatmoney(+d.approp_percap14));
            d3.select("#tt_approp_percap0114").text(formatpct(+d.approp_percap0114));
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