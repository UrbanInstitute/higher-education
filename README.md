#Funding Public Higher Education feature

##Data
* Researcher-provided XLSX files contain data from several sources
* Read and process data from XLSX using [processdata.R](scripts/processdata.R) to create two data CSVs
 * [annualdata.csv](data/annualdata.csv) has all yearly data, [statedata.csv](data/statedata.csv) has wide data used for both graphs and creation of json
* Create [state-level topojson](data/states.json) using [20m shapefile](http://www2.census.gov/geo/tiger/GENZ2014/shp/cb_2014_us_state_20m.zip) and [statedata.csv](data/statedata.csv) in [topojson.sh](scripts/topojson.sh) - currently saving as .txt to get around .json server issues
* Final formatted data used in this feature is available for download: [DataforDownload.xlsx](data/DataforDownload.xlsx)

##Graphs
* Globals and dispatch functions are defined in [graphsconfig.js](js/graphsconfig.js)
* Each section's graphs and tooltip text are configured [section]graphs.js
* Graph functions are in separate files for dev ease, only included in section html's as needed