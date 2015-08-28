#Plans for higher ed feature

##Chart types
* Slope chart
* Line chart
* Bar chart
* Split bar chart
* Choropleth map
* Paired maps: choropleth and categorical

##Sections
###Tuition
* Slope charts: tuition in fiscal years 2005, 2010, 2015 - 2 year, 4 year instate, in 2015 $
 * Paired with text lines and choropleth map of 4 year instate percentage change since 2005
 * tuition_2year, tuition_4year
* Slope chart of 2 year, 4 year instate, 4 year out of state tuition: plotting position relative to median

###Enrollment
* Bar chart: share of public FTE enrollments that are in a 2 year school
 * Paired with choropleth map, both colored the same
 * ftepubin2year
* 2 side by side maps of migration
 * Share of state resident students who enroll instate
  * res_pct_instate
 * Share of students at state schools who are from another state
  * state_pct_outstate
 * Different colors
 * Hover tooltips
* Line chart: percentage change in enrollment since FY01
 * Paired with choropleth map of % change 2001-2015
 * enroll_change
 
###Funding and Appropriations
* Split bar chart: state grant aid, need-based vs non-need-based in $ amounts
 * Divided into two columns by above/below 50% need-based
 * Paired with map of above/below 50% need-based (categorical)
 * grants_needbased, grants_nonneedbased
* Line chart: Percentage change in appropriations (2015 $) since 2001
 * Paired with choropleth map of % change 2001-2015
 * approp_change
* Line chart: Appropriations per FTE student since 2001 in 2015 $
 * Paired with choropleth map of % change per FTE student 2001-2015
 * approp_percap