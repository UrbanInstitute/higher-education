#Hannah Recht, 08-10-15
#Lumina higher ed dashboard
#Analyze data

require(ggplot2)
require(extrafont)

adt <- read.csv("data/annualdata.csv", stringsAsFactors = F)
al <- read.csv("data/annualdata_long.csv", stringsAsFactors = F)
sdt <- read.csv("data/statedata.csv", stringsAsFactors = F)

#Line chart
enrollchart <- ggplot(al, aes(x=year, y=enroll_change, group=abbrev)) +
  geom_line() +
  ggtitle("Enrollment by State - Change from 2001") +
  theme(panel.grid.minor=element_blank(), 
        panel.grid.major.x=element_blank(),
        axis.title.y=element_blank(),
        axis.title.x=element_text(size=12,family="Lato",face="bold"),
        axis.text = element_text(size=6, family="Lato", color="#444444"),
        plot.title = element_text(size=16, family="Lato")) 
enrollchart
png(filename = "img/enrollment_change.png", width=1800, height=1000, res=200)
enrollchart
dev.off()

apchart <- ggplot(al, aes(x=year, y=approp_change, group=abbrev)) +
  geom_line() +
  ggtitle("Appropriations by State - Change from 2001") +
  theme(panel.grid.minor=element_blank(), 
        panel.grid.major.x=element_blank(),
        axis.title.y=element_blank(),
        axis.title.x=element_text(size=12,family="Lato",face="bold"),
        axis.text = element_text(size=6, family="Lato", color="#444444"),
        plot.title = element_text(size=16, family="Lato")) 
apchart
png(filename = "img/appropriations_change.png", width=1800, height=1000, res=200)
apchart
dev.off()