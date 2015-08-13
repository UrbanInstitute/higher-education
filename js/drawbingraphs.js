//one function for each graph to make
function ftebins() {
    $BINDIV = $("#fte");
    BREAKS = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000];
    FORMATTER = d3.format("$,");
    isMobile = false;
    BINVAL = "fundingfte";

    binnedData = [];

    formatData();
    bingraph("#fte");

}

function twoyearbins() {
    $BINDIV = $("#twoyear");
    BREAKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    FORMATTER = d3.format("%");
    isMobile = false;
    BINVAL = "ftepubin2year";

    binnedData = [];

    formatData();
    bingraph("#twoyear");

}

function grantbins() {
    $BINDIV = $("#grants");
    BREAKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    FORMATTER = d3.format("%");
    isMobile = false;
    BINVAL = "grants_needbased";

    binnedData = [];

    formatData();
    bingraph("#grants");

}

function enrollchart() {
    $LINEDIV = $("#enrollment");
    LINEVAL = "enroll_change";
    isMobile = false;
    NUMTICKS = 14;
    linechart("#enrollment");
}

function appropchart() {
    $LINEDIV = $("#appropriations");
    LINEVAL = "approp_change";
    isMobile = false;
    NUMTICKS = 14;
    linechart("#appropriations");
}


function bincharts() {
    ftebins();
    twoyearbins();
    grantbins();
    enrollchart();
    appropchart();

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
        d3.csv(bingraph_data_url, function (error, rates) {
            d3.csv(linechart_data_url, function (annualrates) {
                data_long = annualrates;
                data_bins = rates.filter(function (d) {
                    return d.abbrev != "US";
                });


                bincharts();
                window.onresize = bincharts;
            });
        });
    }
});