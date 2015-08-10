#Hannah Recht, 08-10-15
#Lumina higher ed dashboard
#Read in data from massive spreadsheet

require(openxlsx)
require(dplyr)

#Read in state matching data - fips, name, abbreviation, region
states<-read.csv("data/states.csv",stringsAsFactors = F)

#File path of spreadsheet
xlp = "data/Tables and Figs Linked Data_8.5.2015.xlsx"

#read in figure and table data
fig1<-readWorkbook(xlp, sheet="Fig. 1", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig2<-readWorkbook(xlp, sheet="Fig. 2", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig3<-readWorkbook(xlp, sheet="Fig. 3", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig4<-readWorkbook(xlp, sheet="Fig. 4", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig5<-readWorkbook(xlp, sheet="Fig. 5", colNames=T, rowNames=F, rows=2:52, cols=1:5)
fig6<-readWorkbook(xlp, sheet="Fig. 6", colNames=T, rowNames=F, rows=2:53, cols=1:7)
fig7<-readWorkbook(xlp, sheet="Fig. 7", colNames=T, rowNames=F, rows=2:53, cols=1:4)
fig8<-readWorkbook(xlp, sheet="Fig. 8", colNames=T, rowNames=F, rows=2:53, cols=1:2)
fig9<-readWorkbook(xlp, sheet="Fig. 9", colNames=T, rowNames=F, rows=2:53, cols=1:2)

#Table 1 and 2 = selected states and years of appropriations - use full Appropriations tab instead
#tab1<-readWorkbook(xlp, sheet="Table 1", colNames=T, rowNames=F, rows=2:17, cols=1:6)
appropriations<-readWorkbook(xlp, sheet="Appropriations", colNames=T, rowNames=F, rows = c(1, 3:53))

#Table 3 = change in enrollment for selected years: use full Enrollment tab instead
#tab3<-readWorkbook(xlp, sheet="Table 3", colNames=T, rowNames=F, rows=2:53, cols=1:5)
enrollment<-readWorkbook(xlp, sheet="Enrollments", colNames=T, rowNames=F, rows=1:52)

#Table 4 - calculations based on figure 7 data of difference in prices between college types
#<-readWorkbook(xlp, sheet="Table 4", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#tab4b<-readWorkbook(xlp, sheet="Table 4", colNames=T, rowNames=F, rows=2:53, cols=3:4)

#Table 5 = increases in tuition, 09-14: College Board tab has full data
#tab5a<-readWorkbook(xlp, sheet="Table 5", colNames=T, rowNames=F, rows=2:53, cols=1:2)
#tab5b<-readWorkbook(xlp, sheet="Table 5", colNames=T, rowNames=F, rows=2:53, cols=3:4)

tab6<-readWorkbook(xlp, sheet="Table 6", colNames=T, rowNames=F, rows=2:52, cols=1:3)

#College Board tab: tuition & fees for 3 college types by year - used for figure 7 data
tuition_pub2<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=1:12)
tuition_pub4<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,14:25))
tuition_priv<-readWorkbook(xlp, sheet="College Board", colNames=T, rowNames=F, rows=3:55, cols=c(1,27:38))

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
colnames(appropriations)<-c("state","appropr_01","appropr_02","appropr_03","appropr_04","appropr_05","appropr_06","appropr_07","appropr_08","appropr_09","appropr_10","appropr_11","appropr_12","appropr_13","appropr_14","appropr_15")
colnames(enrollment)<-c("state","enroll_01","enroll_02","enroll_03","enroll_04","enroll_05","enroll_06","enroll_07","enroll_08","enroll_09","enroll_10","enroll_11","enroll_12","enroll_13","enroll_14","enroll_15")

#figure 7 data = differentials between tution types - get full prices and delete differentials
colnames(fig7)<-c("state","tf2","add4","add_outstate")
fig7 <- fig7 %>% mutate(tf4_instate = tf2 + add4, tf4_outstate = tf4_instate + add_outstate) %>% 
  select(-c(add4,add_outstate))

#get data ready for matching - replace total = United States where needed, capitalize state names where needed, remove trailing spaces
trim <- function (x) gsub("^\\s+|\\s+$", "", x)
simpleCap <- function(x) {
  s <- strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1,1)), substring(s, 2),
        sep="", collapse=" ")
}

dfList <- list(fig1 = fig1, fig2=fig2, fig3=fig3, fig4=fig4, fig5=fig5, fig6=fig6, fig7=fig7, fig8=fig8, fig9=fig9, tab6 = tab6, appropriations = appropriations, enrollment = enrollment)
dfList <- lapply(dfList, function(df) {
  df$state = trim(df$state)
  df$state = sapply(df$state, simpleCap)
  df <- mutate(df, state = ifelse(state=="TOTAL"|state=="Totals"|state=="Total"|state=="US TOTAL"|state=="US","United States",
                                    state))
  return(df)
})
fig1 <- dfList$fig1
fig2 <- dfList$fig2
fig3 <- dfList$fig3
fig4 <- dfList$fig4
fig5 <- dfList$fig5
fig6 <- dfList$fig6
fig7 <- dfList$fig7
fig8 <- dfList$fig8
fig9 <- dfList$fig9
enrollment <- dfList$enrollment
appropriations <- dfList$appropriations
tab6 <- dfList$tab6

#Join data
#Appropriations and enrollment
apen <- left_join(appropriations,enrollment,by="state")
apen<- left_join(states, apen, by="state")
apen <- apen %>% filter (statefip != 11)
write.csv(apen,"data/annualdata.csv",row.names=F, na="")

dt<- left_join(states,fig1,by="state")
dt <- left_join(dt,fig2,by="state")
dt <- left_join(dt,fig3,by="state")
dt <- left_join(dt,fig4,by="state")
dt <- left_join(dt,fig5,by="state")
dt <- left_join(dt,fig6,by="state")
dt <- left_join(dt,fig7,by="state")
dt <- left_join(dt,fig8,by="state")
dt <- left_join(dt,fig9,by="state")
dt <- left_join(dt,tab6,by="state")
dt <- dt %>% filter (statefip != 11)
write.csv(dt,"data/statedata.csv",row.names=F, na="")