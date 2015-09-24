function tuitiontime() {
    FORMATTER = formatmoney;
    YEARVAL = "fiscalyear";

    function twoyear() {
        $GRAPHDIV = $("#tuition2year");
        LABELS = "Two-year in-district";
        LINEVAL = "tuition_2year";
        slopechart3("#tuition2year");
    };
    twoyear();

    function fouryear() {
        $GRAPHDIV = $("#tuition4year");
        LABELS = "Four-year in-state";
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

/*function tuition15() {
    $GRAPHDIV = $("#tuitionrank");
    VAL = ["t2_15_rank", "t4_15_rank", "t4outstate_15_rank"];
    LABELS = ["Two-year in-district", "Four-year in-state", "Four-year out-of-state"];
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
}*/

function tuition15() {
    $GRAPHDIV = $("#tuitionrank");
    VAL = ["t2_15_rank", "t4_15_rank", "t4outstate_15_rank"];
    LABELS = ["Two-year in-district", "Four-year in-state", "Four-year out-of-state"];
    rankingchart("#tuitionrank");
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

function scatterrank() {
    $GRAPHDIV = $("#scatterrank");
    VAL = ["t4_15", "t2_15"];
    FORMATTER = d3.format("$2s");
    LABELS = ["Four-year in-state", "Two-year in-district"];
    scatterplot("#scatterrank");
    COLORS = palette.blue5;
    BREAKS = [7000, 8000, 9000, 10000]

    function pairedmap() {
        $GRAPHDIV = $("#map_tuition152");
        VAL = "t4_15";
        MAINMAP = 0;
        map("#map_tuition152");
    }
    pairedmap();

    function maplegend() {
        $LEGENDDIV = $("#legend_tuition152");
        FORMATTER = formatmoney;
        legend("#legend_tuition152");
    }
    maplegend();
}

function scatterrank2() {
    $GRAPHDIV = $("#scatterrank2");
    VAL = ["t4_15", "t4outstate_15"];
    FORMATTER = d3.format("$2s");
    LABELS = ["Four-year in-state", "Four-year out-of-state"];
    scatterplot("#scatterrank2");
}

function drawgraphs() {
    tuitiontime();
    tuition15();
    scatterrank();
    scatterrank2();
    d3.selectAll("[id='US']")
        .classed("selected", true)
        .moveToFront();
}

//pass values from the main csv to html for page "tooltips" - switch values on dropdown selection
function tooltip(state) {
    data = data_main;
    var row = data.filter(function (d) {
        return d.abbrev == state;
    });

    function formatRank(d) {
        if (d >= 1) {
            return d = d + " of 50";
        } else {
            return "";
        }
    }

    row.forEach(function (d) {
        d3.selectAll(".tt-name").text(d.state);
        //tuition
        d3.select("#tt_t2_05").text(formatmoney(+d.t2_05));
        d3.selectAll(".tt_t2_15").text(formatmoney(+d.t2_15));
        d3.select("#tt_t2_0515").text(formatpct(d.t2_0515));
        d3.select("#tt_t4_05").text(formatmoney(+d.t4_05));
        d3.selectAll(".tt_t4_15").text(formatmoney(+d.t4_15));
        d3.select("#tt_t4_0515").text(formatpct(+d.t4_0515));
        d3.selectAll(".tt_t4outstate_15").text(formatmoney(+d.t4outstate_15));
        d3.selectAll(".tt_t2_15_rank").text(formatRank(+d.t2_15_rank));
        d3.selectAll(".tt_t4_15_rank").text(formatRank(+d.t4_15_rank));
        d3.selectAll(".tt_t4outstate_15_rank").text(formatRank(+d.t4outstate_15_rank));
    });
}