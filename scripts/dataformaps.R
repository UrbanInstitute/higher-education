#Hannah Recht, 08-31-15
#Lumina higher ed dashboard
#Dataset to match on to state topojson

library(dplyr)

dt <- read.csv("data/statedata.csv",stringsAsFactors = F)
mapdt <- dt %>% select(statefip,abbrev,ftepubin2year,res_pct_instate,state_pct_outstate,grants_pctneedbased) %>% rename(STATEFP = statefip)
write.csv(mapdt,"data/mapdata.csv",row.names=F, na="")