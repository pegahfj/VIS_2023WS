# TASK 1:

# a: Creating a choropleth map and filling each state's polygon on the map with a color representing the average personal income vs. educational attainment in that state for the currently selected year. Use the AlbersUSA map projection with d3's function: d3.geoAlbersUsa()

In ChoroplethMap component, the method drawMap draws the USA map and its state using d3.geoAlbersUsa projections. It extract the shapes and stores them in a variable called "paths" then using the method handleFillColor which has the responsibility to return the color by normalizing the income and education values for each state then calculate the average of the normalized values. Then it uses the color scale to map the average to a color.


# b: Creating a scatter plot with 1) the x-axis displaying the educational attainment rate (bachelor's degree or higher) in a state, and 2) y-axis displaying the average personal yearly income in a state. The background of the scatter plot should be divided and filled by the 3x3 color scheme you have defined. The axes and their scales are labeled.

In Scatterplot component, the method drawScatterPlot draws the scatterplot and its axis (line 51-70) both labeled. It draws the color scheme as rectangles dividing the coordinate plane, then the dots are drawn from the data passed onto them.  

-----------------------------------------------------------------------------------

# TASK 2:

# a: Implement a year slider which interactively changes the data displayed both in the choropleth and the scatter plot.

The component YearSlider is integrated both into ChoroplethMap and Scatterplot to change the data in these visualization as the year changes.


# b: On mouseover each data point (circle) on the scatter plot shows a tooltip containing the name of that state.

This feature is done by handleMouseOver (line 129) in the scatter plot drawCircles method.
-----------------------------------------------------------------------------------

# TASK 3:

# a: Implement brushing on the scatter plot. Only the states corresponding to the data points which are selected by the brushed rectangle will be shown on the map and the other states will be grayed out. Clicking an empty area inside the scatter plot should deactivate the brush selection.

-----------------------------------------------------------------------------------

# TASK 4:

# a:  Interactivity on the map: on mouseclick on a state the data point of that particular state on the scatter plot is highlighted. Clicking an empty area inside the map component should deactivate the highlighting.

# b: Add a title (an HTML "h1" element on top) summarizing the visualization
The title is added on top as mentioned.

# Written by Pegah Farajzadeh