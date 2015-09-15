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
    data2 = data_long;
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

function drawgraphs() {
    fte2year();
    map_instate();
    map_outstate();
    enrollchart();

    d3.selectAll("[id='US']")
        .classed("selected", true);

}

dispatch.on("load.menu", function (stateById) {

    //pass values from the main csv to html for page "tooltips" - switch values on dropdown selection
    function tooltip() {
        data = data_main;
        var row = data.filter(function (d) {
            return d.abbrev == menu_id
        });

        row.forEach(function (d) {
            d3.selectAll(".tt-name").text(d.state);
            d3.select("#tt_ftepubin2year").text(formatpct(+d.ftepubin2year));
            d3.select("#tt_enroll15").text(formatnum(+d.enroll_15));
            d3.select("#tt_enroll0115").text(formatpct(+d.enroll0115));
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