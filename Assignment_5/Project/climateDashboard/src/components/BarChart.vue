<template>
  <div class="vis-component" ref="chart">
    <svg id="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup">
        <g class="axis axis-x" ref="axisX"></g>
        <g class="axis axis-y" ref="axisY"></g>
        <g class="bars-group" ref="barsGroup"></g>
      </g>
    </svg>
  </div>
</template>

<script>

import * as d3 from 'd3';

export default {
  name: 'BarChart',
  props: {
  },
  data() {
    return {
      svgWidth: 800,
      svgHeight: 500,
      svgPadding: {
        top: 25, right: 20, bottom: 70, left: 20,
      },
    }
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      d3.select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
      this.drawXAxis();
      this.drawYAxis();
      this.drawBars();
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
    drawBars() {
      const barsGroup = d3.select(this.$refs.barsGroup);
      barsGroup.selectAll('.bar')
        .data(this.totDisaster.filter(d => d.value && d.value > 0))
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => this.xScale(d.country))
        .attr('y', (d) => this.yScale(d.value))
        .attr('width', this.xScale.bandwidth())
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d.value))
        .on('click', (event, d) => this.handleBarClick(d.country));
    },
    handleBarClick(val) {
      this.$store.commit('changeSelectedCountry', val);
    }
  },
  computed: {
    totDisaster: {
      get() {
        console.log("The value of totDisaster is:", this.$store.getters.totDisaster);
        return this.$store.getters.totDisaster;
      }
    },
    dataMax() {
      return Math.max(d3.max(this.totDisaster, (d) => d.value));
    },
    dataMin() {
      return d3.min(this.totDisaster, (d) => d.value);
    },
    xScale() {
      return d3.scaleBand()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right]).padding(0.3)
        .domain(this.totDisaster.filter(d => d.value && d.value > 0).map((d) => d.country));

        // .domain(this.totDisaster.map((d) => d.country));
    },
    yScale() {
      return d3.scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    },
  },
  watch: {
    totDisaster: {
      handler() {
        this.drawChart();
      },
      deep: true,
    },
  },
}
</script>

<style>
.bar {
  fill: steelblue;
}

.bar:hover {
  fill: lightblue;
}
</style>
