function tuition15() {
    $GRAPHDIV = $("#tuitionrank");
    VAL = ["t2_15_rank", "t4_15_rank", "t4outstate_15_rank"];
    LABELS = ["Two-year", "Four-year in-state", "Four-year out-of-state"];
    rankchart("#tuitionrank");
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

function drawgraphs() {
    tuition15();
    tuitiontime();

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
            //tuition
            d3.select("#tt_t2_15_rank").text(+d.t2_15_rank);
            d3.select("#tt_t4_15_rank").text(+d.t4_15_rank);
            d3.select("#tt_t4outstate_15_rank").text(+d.t4outstate_15_rank);
            d3.select("#tt_t2_05").text(formatmoney(+d.t2_05));
            d3.select("#tt_t2_15").text(formatmoney(+d.t2_15));
            d3.select("#tt_t2_0515").text(formatpct(d.t2_0515));
            d3.select("#tt_t4_05").text(formatmoney(+d.t4_05));
            d3.select("#tt_t4_15").text(formatmoney(+d.t4_15));
            d3.select("#tt_t4_0515").text(formatpct(+d.t4_0515));
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

