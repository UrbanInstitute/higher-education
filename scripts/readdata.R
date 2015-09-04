#Hannah Recht, 08-10-15
#Lumina higher ed dashboard
#Read in data from massive spreadsheet, format, export two CSVs
#   1. statedata - variables that we aren't annual, by state
#   2. annualdata - variables by both state and fiscal year: enrollment, appropriations, tuition

library(openxlsx)
library(dplyr)
library(tidyr)

#Read in state matching data - fips, name, abbreviation, region
states<-read.csv("data/states.csv",stringsAsFactors = F)

#File path of spreadsheet
xlp = "data/original/Data for Brief_8.26.2015.xlsx"

########################################################################################################
# formatState for matching on state name column
# Replace total row = "United States" where needed, capitalize state names where needed, 
# remove trailing spaces, replace misspelled names
########################################################################################################

trim <- function (x) gsub("^\\s+|\\s+$", "", x)
simpleCap <- function(x) {
  s <- strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1,1)), substring(s, 2),
        sep="", collapse=" ")
}

formatState <- function(dt) {
  dt$state = trim(dt$state)
  dt$state = sapply(dt$state, simpleCap)
  dt <- mutate(dt, state = ifelse(state=="TOTAL"|state=="Totals"|state=="Total"|state=="US TOTAL"|state=="US","United States",
                                  ifelse(state=="Arkansasc", "Arkansas",
                                         ifelse(state=="Illinoisd","Illinois",
                                                ifelse(state=="Missourie","Missouri",
                                                       ifelse(state=="Tennesseef", "Tennessee",
                                                              ifelse(state=="South Caroilna", "South Carolina",
                                                              state))))))) %>% 
    arrange(state)
}

########################################################################################################
# Read, format, join non-annual data
########################################################################################################

fig1<-readWorkbook(xlp, sheet="Fig. 1", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig2<-readWorkbook(xlp, sheet="Fig. 2", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig3<-readWorkbook(xlp, sheet="Fig. 3", colNames=T, rowNames=F, rows=2:53, cols=1:2)
tab6<-readWorkbook(xlp, sheet="Table 6", colNames=T, rowNames=F, rows=2:53, cols=1:3)
migration<-readWorkbook(xlp, sheet="Migration", colNames=F, rowNames=F, rows=9:59, cols=1:11)

#Table 1 and 2 = selected states and years of appropriations - use full Appropriations tab instead
#Table 3 = change in enrollment for selected years: use full Enrollment tab instead
#Table 4 - calculations based on figure 7 data of difference in prices between college types
#Table 5 = increases in tuition, 09-14: College Board tab has full data

#give meaningful col names
colnames(fig1)<- c("state","approp_percap15")
colnames(fig2)<- c("state","fundingperthousinc")
colnames(fig3)<- c("state","ftepubin2year")
colnames(tab6)<- c("state","grants_perfte","grants_pctneedbased")

#tab 6 - add breakdown of grants by need vs non-need based in $s
tab6$grants_pctneedbased <- as.numeric(tab6$grants_pctneedbased)
tab6 <- tab6 %>% mutate(grants_needbased = ifelse(grants_perfte==0, 0, grants_perfte*grants_pctneedbased)) %>%
  mutate(grants_nonneedbased = ifelse(grants_perfte==0, 0, grants_perfte*(1-grants_pctneedbased)))

#Migration data: Residence and migration of all first-time degree/certificate-seeking undergrates in degree-granting postsecondary institutions who graduated from high school in the previous 12 months, Fall 2012
#This replaces fig4
#res_pct_instate = percent of state resident first-time college students who stay in the state for college
#state_enroll = total first-time enrollment in the state = res_enroll_instate + state_enroll_outstate
#res_enroll_total = total number of state residents enrolling in college = res_enroll_instate + res_enroll_outstate
#res_enroll_instate = state residents staying in the state for college
#res_enroll_outstate = state residents enrolling in another state
#state_enroll_outstate = students at state schools who are enrolling as out-of-state students (residents of other states)
#migration_net = residents leaving vs out-of-state students coming in = state_enroll_outstate - res_enroll_outstate
migration <- migration %>% select(-X6, -X7)
colnames(migration) <- c("state","res_pct_instate","state_enroll","res_enroll_total","res_enroll_instate","res_enroll_outstate","state_enroll_outstate","migration_net")
migration <- migration %>% mutate(state_pct_outstate = state_enroll_outstate / state_enroll)

fig1 <- formatState(fig1)
fig2 <- formatState(fig2)
fig3 <- formatState(fig3)
tab6 <- formatState(tab6)
migration <- formatState(migration)

########################################################################################################
# Annual enrollment and appropriations data: read and add percentage change 2001-2015 for maps
########################################################################################################

enrollment<-readWorkbook(xlp, sheet="Enrollments", colNames=T, rowNames=F, rows=1:52)
appropriations<-readWorkbook(xlp, sheet="Appropriations", colNames=T, rowNames=F, rows = c(1, 3:53))

colnames(appropriations) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")
colnames(enrollment) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")

#Data for map
enrollment_map <- formatState(enrollment) %>% 
  mutate(enroll0115 = (fy_15 - fy_01)/fy_01)
appropriations_map <- formatState(appropriations)%>% 
  mutate(approp0115 = (fy_15 - fy_01)/fy_01)

apen <- left_join(appropriations_map,enrollment_map,by="state") %>% 
  mutate(approp_percap0115 = (((fy_15.x/fy_15.y) - (fy_01.x/fy_01.y))/ (fy_01.x/fy_01.y))) %>% 
  select(state,approp0115,enroll0115,approp_percap0115,fy_15.x,fy_15.y) %>% 
  rename(approp_15 = fy_15.x, enroll_15 = fy_15.y)

########################################################################################################
# College Board tab: tuition & fees by year for 2 year public and 4 year public instate 2001-2015
# Figure 7 tab for 2015 4 year public out of state cost
########################################################################################################

tuition_pub2<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=1:12)
tuition_pub4<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,14:25))

formatTuition <- function(dt) {
  colnames(dt) <-c ("state","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")
  dt <- filter(dt,state!="Puerto Rico" & state!="District of Columbia")
  dt <- formatState(dt)
}
tuition_pub2 <- formatTuition(tuition_pub2)
tuition_pub4 <- formatTuition(tuition_pub4)

#Coerce numbers to numeric
cols <- c(2, 3:ncol(tuition_pub2))
tuition_pub2[cols] <- as.numeric(as.matrix(tuition_pub2[cols]))

#Join 2005 and 2010 tuition for slope charts
tuition <- left_join(tuition_pub2, tuition_pub4, by="state") %>%
  select(state, fy_05.x, fy_10.x, fy_15.x, fy_05.y, fy_10.y, fy_15.y)
colnames(tuition) <- c("state","t2_05","t2_10", "t2_15", "t4_05","t4_10", "t4_15")

#figure 7 data - get 2015 out of state 4 year price
fig7<-readWorkbook(xlp, sheet="Fig. 7", colNames=T, rowNames=F, rows=2:53, cols=1:4)
colnames(fig7)<-c("state","t2_15","add4","add_outstate")
fig7 <- formatState(fig7)
fig7 <- fig7 %>% mutate(t4outstate_15 = t2_15 + add4 + add_outstate) %>% 
  select(state, t4outstate_15)

tuition <- left_join(tuition,fig7,by="state") %>% mutate(t4_0515 = ((t4_15-t4_05)/t4_05))

#Join non-annual data for graphs and maps!
dt <- left_join(states,fig1,by="state")
dt <- left_join(dt,fig2,by="state")
dt <- left_join(dt,fig3,by="state")
dt <- left_join(dt,tab6,by="state")
dt <- left_join(dt,migration,by="state")
dt <- dt %>% filter (statefip != 11) %>% select(-region)
dt <- left_join(dt,apen,by="state")
dt <- left_join(dt, tuition, by="state")
#to match with shapefile
dt <- dt %>% rename(STATEFP=statefip)
write.csv(dt,"data/statedata.csv",row.names=F, na="")

rm(fig1,fig2,fig3,fig7,tab6,migration,apen,tuition,appropriations_map,enrollment_map)

########################################################################################################
# Annual enrollment and appropriations data: format, make long, join
########################################################################################################
#Long data
formatLong <- function(dt) {
  dt <- formatState(dt) %>%
    mutate(base = fy_01)
  long <- dt %>% gather(fiscalyear,value,2:16)
  long$fiscalyear <- as.character(long$fiscalyear)
  long <- long %>% mutate(fiscalyear=sapply(strsplit(long$fiscalyear, split='_', fixed=TRUE),function(x) (x[2])))
  long$fiscalyear <- as.numeric(long$fiscalyear)
  long <- long %>% mutate(fiscalyear = fiscalyear + 2000, change = (value-base)/base) %>% 
    select(-base)
}
enrollment <- formatLong(enrollment) %>% 
  rename(enrollment = value, enroll_change = change)
appropriations <- formatLong(appropriations) %>% 
  rename(appropriations = value, approp_change = change)

apen_long <- left_join(enrollment,appropriations,by=c("state","fiscalyear")) %>% 
  arrange(state, fiscalyear)
apen_long <- right_join(states,apen_long, by="state") %>% 
  select(-region) %>% 
  mutate(approp_percap = appropriations/enrollment)

rm(appropriations, enrollment)

########################################################################################################
# Annual tuition data for 2 year public and 4 year public instate - make long, join to long dataset
########################################################################################################

#Make long
formatLong <- function(dt) {
  long <- dt %>% gather(fiscalyear,tuition,2:12)
  long$fiscalyear <- as.character(long$fiscalyear)
  long <- long %>% mutate(fiscalyear=sapply(strsplit(long$fiscalyear, split='_', fixed=TRUE),function(x) (x[2])))
  long$fiscalyear <- as.numeric(long$fiscalyear)
  long <- long %>% mutate(fiscalyear = fiscalyear + 2000)
}
tuition_pub2 <- formatLong(tuition_pub2) %>% 
  rename(tuition_2year = tuition)
tuition_pub4 <- formatLong(tuition_pub4) %>%
  rename(tuition_4year = tuition)

tuition_long <- left_join(tuition_pub2,tuition_pub4, by=c("state","fiscalyear"))
tuition_long <- right_join(states,tuition_long, by="state") %>% 
  select(-region)

## Join all the long data!
dt_long <- left_join(apen_long,tuition_long,by=c("state","statefip","abbrev","fiscalyear"))
write.csv(dt_long,"data/annualdata.csv",row.names=F, na="")

rm(tuition_pub2,tuition_pub4,apen_long,tuition_long)

########################################################################################################
# Data that we're not currently using, may in future
########################################################################################################
#fig4<-readWorkbook(xlp, sheet="Fig. 4", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#fig5<-readWorkbook(xlp, sheet="Fig. 5", colNames=T, rowNames=F, rows=2:52, cols=1:5)
#fig6<-readWorkbook(xlp, sheet="Fig. 6", colNames=T, rowNames=F, rows=2:53, cols=1:7)
#fig8<-readWorkbook(xlp, sheet="Fig. 8", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#fig9<-readWorkbook(xlp, sheet="Fig. 9", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#a1<-readWorkbook(xlp, sheet="B1. A1", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#Not currently using private school data
#tuition_priv<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,26:38))

#colnames(fig4)<- c("state","hsgradsinstate")
#colnames(fig5)<- c("flagship","state","flagship_instate","flagship_outstate","flagship_foreign")
#colnames(fig6)<- c("state","white","black","hispanic","asian","other","nonres")
#colnames(fig8)<- c("state","expendfte_pub4")
#colnames(fig9)<- c("state","statefunding_pctgrants")
#colnames(a1)<- c("state","familyinc_median")

#fig4 <- formatState(fig4)
#fig5 <- formatState(fig5)
#fig6 <- formatState(fig6)
#fig8 <- formatState(fig8)
#fig9 <- formatState(fig9)
#a1 <- formatState(a1)
