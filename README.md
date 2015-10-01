#Funding Public Higher Education feature

##Data
* Researcher-provided XLSX files contain data from several sources
* Read and process data from XLSX using [processdata.R](scripts/processdata.R) to create two data CSVs
 * [annualdata.csv](data/annualdata.csv) has all yearly data, [statedata.csv](data/statedata.csv) has wide data used for both graphs and creation of json
* Create [state-level topojson](data/states.txt) with [topojson.sh](scripts/topojson.sh) using [20m shapefile](https://www.census.gov/geo/maps-data/data/cbf/cbf_state.html) and [statedata.csv](data/statedata.csv)  - currently saving as .txt to get around .json server issues
* Final formatted data used in this feature is available for download: [DataforDownload.xlsx](data/DataforDownload.xlsx)

##Graphs
* All graphs built in d3 and require modernizr for responsiveness. Maps require topojson
* Globals and dispatch functions are defined in [graphsconfig.js](js/graphsconfig.js)
* Each section's graphs and tooltip text are configured in [section]graphs.js
* Graph functions are in separate files for dev ease and only included in section htmls as needed - only map.js required in all 3 sections