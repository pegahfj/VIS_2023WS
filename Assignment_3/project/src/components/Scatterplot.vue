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
    },
    drawXAxis() {
      d3.select(this.$refs.axisX)
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`)
        .call(d3.axisBottom(this.xScale))
        .selectAll('text')
        .attr('y', 0)
        .attr('x', -7)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'end');
    },
    drawYAxis() {
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
      var bgRect = bg.selectAll('rect')
            .data(d3.pairs(d3.merge([[y.domain()[0]], color.domain(), [y.domain()[1]]])))
        bgRect.exit().remove()
        bgRect.enter().append('rect')
            .attr('x', 0)
            .attr('width', width)
            .merge(bgRect)
            .attr('y', function (d) { return y(d[1]) })
            .attr('height', function (d) { return y(d[0]) - y(d[1]) })
            .style('fill', function (d) { return color(d[0]) })

    },
    drawDots() {
      
      var scatterPlot = d3.select(this.$refs.scatterPlot);
      scatterPlot.selectAll('.plot')
      .data()
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
    dataMax() {
      return Math.max(d3.max(this.personaleIncome, (d) => d.value), 85000);
    },
    dataMin() {
      return d3.min(this.personaleIncome, (d) => d.value);
    },
    xScale() {
      return d3.scaleBand()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]).padding(0.1)
        .domain(this.personaleIncome.map((d) => d.state));
    },
    yScale() {
      return d3.scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
