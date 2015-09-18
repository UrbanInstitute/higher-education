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
    data2 = data_long.filter(function (d) {
        return d.fiscalyear < 2015;
    });;
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
        VAL = "enroll0114";
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

function drawgraphs() {
    fte2year();
    map_instate();
    map_outstate();
    enrollchart();

    d3.selectAll("[id='US']")
        .classed("selected", true);

}

//pass values from the main csv to html for page "tooltips" - switch values on dropdown selection
function tooltip() {
    data = data_main;
    var row = data.filter(function (d) {
        return d.abbrev == menuId
    });

    row.forEach(function (d) {
        d3.selectAll(".tt-name").text(d.state);
        d3.select("#tt_ftepubin2year").text(formatpct(+d.ftepubin2year));
        d3.select("#tt_enroll14").text(formatnum(+d.enroll_14));
        d3.select("#tt_enroll0114").text(formatpct(+d.enroll0114));
    });
}