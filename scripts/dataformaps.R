#Hannah Recht, 08-31-15
#Lumina higher ed dashboard
#Dataset to match on to state topojson

library(openxlsx)
library(dplyr)
library(tidyr)

#Read in state matching data - fips, name, abbreviation, region
states<-read.csv("data/states.csv",stringsAsFactors = F)

#File path of spreadsheet
xlp = "data/original/Data for Brief_8.26.2015.xlsx"

dt <- read.csv("data/statedata.csv",stringsAsFactors = F)
mapdt <- dt %>% select(statefip,state,abbrev,ftepubin2year,res_pct_instate,state_pct_outstate,grants_pctneedbased) %>% rename(STATEFP = statefip)

#Enrollment and appropriations percent change
enrollment<-readWorkbook(xlp, sheet="Enrollments", colNames=T, rowNames=F, rows=1:52)
appropriations<-readWorkbook(xlp, sheet="Appropriations", colNames=T, rowNames=F, rows = c(1, 3:53))

colnames(appropriations) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")
colnames(enrollment) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")

enrollment <- formatState(enrollment) %>% 
  mutate(enroll0115 = (fy_15 - fy_01)/fy_01)
appropriations <- formatState(appropriations)%>% 
  mutate(approp0115 = (fy_15 - fy_01)/fy_01)

apen <- left_join(appropriations,enrollment,by="state") %>% 
  mutate(approp_percap0115 = (((fy_15.x/fy_15.y) - (fy_01.x/fy_01.y))/ (fy_01.x/fy_01.y))) %>% select(state,approp0115,enroll0115,approp_percap0115)
mapdt <- left_join(mapdt,apen,by="state")
write.csv(mapdt,"data/mapdata.csv",row.names=F, na="")