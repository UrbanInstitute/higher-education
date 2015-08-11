//one function for each graph to make
function ftebins() {
    $BINDIV = $("#fte"),
    BREAKS = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000];
    FORMATTER = d3.format("$,");
    BINVAL = "fundingfte";
    
    binnedData = [];

    formatData();
    bingraph("#fte");

}

function twoyearbins() {
    $BINDIV = $("#twoyear"),
    BREAKS = [0,0.1,0.2,0.3,0.4,0.5,0.6];
    FORMATTER = d3.format("%");
    BINVAL = "ftepubin2year";

    binnedData = [];
    
    formatData();
    bingraph("#twoyear");

}

function bincharts() {
    ftebins();
    twoyearbins();
    
    var allbars = d3.selectAll(".bin");
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
            data = rates.filter(function (d) {
                return d.abbrev != "US";
            });


            bincharts();
            window.onresize = bincharts;
        });
    }
});