topojson -o data/states.json -e data/mapdata.csv --id-property=+STATEFP -p name=NAME,abbrev,+ftepubin2year,+res_pct_instate,+state_pct_outstate,+grants_pctneedbased -- geo/cb_2014_us_state_20m/cb_2014_us_state_20m.shp