#Hannah Recht, 08-10-15
#Lumina higher ed dashboard
#Read in data from massive spreadsheet, format, export two CSVs
#   1. statedata - variables that we aren't annual, by state
#   2. annualdata - variables by both state and fiscal year: enrollment, appropriations, tuition

library(openxlsx)
library(dplyr)
library(tidyr)
library(reshape2)

#Read in state matching data - fips, name, abbreviation, region
states<-read.csv("data/states.csv",stringsAsFactors = F)

#File path of spreadsheet
xlp = "data/Data for Brief_8.21.2015_updated_FYinflation_with clean tables.xlsx"

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
                                                              state)))))) %>% 
    arrange(state)
}

########################################################################################################
# Read, format, join non-annual data
########################################################################################################

fig1<-readWorkbook(xlp, sheet="Fig. 1", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig2<-readWorkbook(xlp, sheet="Fig. 2", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig3<-readWorkbook(xlp, sheet="Fig. 3", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig4<-readWorkbook(xlp, sheet="Fig. 4", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig5<-readWorkbook(xlp, sheet="Fig. 5", colNames=T, rowNames=F, rows=2:52, cols=1:5)
fig6<-readWorkbook(xlp, sheet="Fig. 6", colNames=T, rowNames=F, rows=2:53, cols=1:7)
fig7<-readWorkbook(xlp, sheet="Fig. 7", colNames=T, rowNames=F, rows=2:53, cols=1:4)
fig8<-readWorkbook(xlp, sheet="Fig. 8", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig9<-readWorkbook(xlp, sheet="Fig. 9", colNames=T, rowNames=F, rows=2:53, cols=1:2)
tab6<-readWorkbook(xlp, sheet="Table 6", colNames=T, rowNames=F, rows=2:52, cols=1:3)

#Table 1 and 2 = selected states and years of appropriations - use full Appropriations tab instead
#Table 3 = change in enrollment for selected years: use full Enrollment tab instead
#Table 4 - calculations based on figure 7 data of difference in prices between college types
#Table 5 = increases in tuition, 09-14: College Board tab has full data

#give meaningful col names
colnames(fig1)<- c("state","fundingfte")
colnames(fig2)<- c("state","fundingperthousinc")
colnames(fig3)<- c("state","ftepubin2year")
colnames(fig4)<- c("state","hsgradsinstate")
colnames(fig5)<- c("flagship","state","flagship_instate","flagship_outstate","flagship_foreign")
colnames(fig6)<- c("state","white","black","hispanic","asian","other","nonres")
colnames(fig8)<- c("state","expendfte_pub4")
colnames(fig9)<- c("state","statefunding_pctgrants")
colnames(tab6)<- c("state","grant_sperfte","grants_needbased")

#figure 7 data = differentials between tution types - get full prices and delete differentials
colnames(fig7)<-c("state","tf2","add4","add_outstate")
fig7 <- fig7 %>% mutate(tf4_instate = tf2 + add4, tf4_outstate = tf4_instate + add_outstate) %>% 
  select(-c(add4,add_outstate))

fig1 <- formatState(fig1)
fig2 <- formatState(fig2)
fig3 <- formatState(fig3)
fig4 <- formatState(fig4)
fig5 <- formatState(fig5)
fig6 <- formatState(fig6)
fig7 <- formatState(fig7)
fig8 <- formatState(fig8)
fig9 <- formatState(fig9)
tab6 <- formatState(tab6)

#Join non-annual data
dt <- left_join(states,fig1,by="state")
dt <- left_join(dt,fig2,by="state")
dt <- left_join(dt,fig3,by="state")
dt <- left_join(dt,fig4,by="state")
dt <- left_join(dt,fig5,by="state")
dt <- left_join(dt,fig6,by="state")
dt <- left_join(dt,fig7,by="state")
dt <- left_join(dt,fig8,by="state")
dt <- left_join(dt,fig9,by="state")
dt <- left_join(dt,tab6,by="state")
dt <- dt %>% filter (statefip != 11) %>% select(-region)
write.csv(dt,"data/statedata.csv",row.names=F, na="")

rm(fig1,fig2,fig3,fig4,fig5,fig6,fig7,fig8,fig9,tab6)

########################################################################################################
# Annual enrollment and appropriations data: read, format, make long, join
########################################################################################################

enrollment<-readWorkbook(xlp, sheet="Enrollments", colNames=T, rowNames=F, rows=1:52)
appropriations<-readWorkbook(xlp, sheet="Appropriations", colNames=T, rowNames=F, rows = c(1, 3:53))

colnames(appropriations) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")
colnames(enrollment) <- c("state","fy_01","fy_02","fy_03","fy_04","fy_05","fy_06","fy_07","fy_08","fy_09","fy_10","fy_11","fy_12","fy_13","fy_14","fy_15")

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
#College Board tab: tuition & fees for 3 college types by year - used for figure 7 data
########################################################################################################

tuition_pub2<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=1:12)
tuition_pub4<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,14:25))
#Not currently using private school data
#tuition_priv<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,26:38))

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
