<template>
  <div class="vis-component" ref="chart">
    <svg id="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
        <g class="axis axis-x" ref="axisX"></g>
        <g class="axis axis-y" ref="axisY"></g>
        <g class="scatter-plot" ref="scatterPlot"></g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Scatterplot',
  props: {
  },
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
    this.drawPlot();

  },
  methods: {
    drawPlot(){
      d3.select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);

      this.drawXAxis();
      this.drawYAxis();
      // this.drawRectangles();
      this.drawDots();
    },
    drawXAxis() {
      // TODO: set xAxis according to the baDegreeOrHigher from store.js
      d3.select(this.$refs.axisX)
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`)
        .call(d3.axisBottom(this.xScale))
        .append("text")
        .attr("y", 0)
        .attr("x", 10)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("BA-degree or higher")
    },
    drawYAxis() {
      // yAxis is similar no changes needed
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end') 
        .attr('fill', 'black')
        .text("Average Yearly Personal Income (in $)");
    },
    drawRectangles(){
      // draw colorScaled rectangles based on the x,y of each data piece -> if x<? && y<? set color fill to colorScale[?]

    },
    drawDots() {
      // draw each dot representing a state with specific x=baDegreeOrHigher, y=personaleIncome
      var circle = svg.selectAll('circle')
            .data(this.personaleIncome)
        circle.exit().remove()
        circle.enter().append('circle')
            .attr('r', 4)
            .style('stroke', '#fff')
            .merge(circle)
            .attr('cx', (d) => this.xScale(d.state))
            .attr('cy', (d) => this.yScale(d.value))
            // .style('fill', function (d) { return color(d.obesity) })
            // .style('opacity', function (d) { return d.filtered ? 0.5 : 1 })
            // .style('stroke-width', function (d) { return d.filtered ? 1 : 2 })
    }
    // basic functionalities similar to prev assignment to load data and draw the diagram
    // drawXAxis, drawYAxis
    // draw bar -> draw the dots
    // draw the rectangle with colors 
    // -> check the x and y to choose which color this block needs
    // 
  },
  computed: {
    personaleIncome: {
      get() {
        // store acts as the (data) state management -> manages the data in this dynamically and updates 
        return this.$store.getters.personaleIncome;
      }
    },
    baDegreeOrHigher: {
      get() {
        return this.$store.getters.baDegreeOrHigher;
      }
    },
    colorScale: {
      get() {
        return this.$store.getters.colorScale;
      }
    },
    incomeMax() {
      return Math.max(d3.max(this.personaleIncome, (d) => d.value), 85000);
    },
    incomeMin() {
      return d3.min(this.personaleIncome, (d) => d.value);
    },
    xScale() {
      return d3.scaleLinear()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]).padding(0.1)
        .domain([0, d3.max(this.baDegreeOrHigher, d=> { return d.value; })]);
    },
    yScale() {
      return d3.scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([this.incomeMin > 0 ? 0 : this.incomeMin, this.incomeMax]);
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
