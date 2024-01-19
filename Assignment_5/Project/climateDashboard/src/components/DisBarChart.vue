<template>
    <div>
      <div class="vis-component" ref="bar-chart">
        <svg id="main-svg" :width="svgWidth" :height="svgHeight">
            <g class="bars-group" ref="barsGroup"></g>
        </svg>
      </div>
      <!-- <input type="range" v-model="selectedYear" :min="minYear" :max="maxYear"> -->
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import * as d3 from 'd3';
  
  export default {
    name: 'DisBarChart',
    data() {
      return {
        svgWidth: 0,
        svgHeight: 500,
        svgPadding: {
        top: 25, right: 20, bottom: 70, left: 40,
      },
      };
    },
    computed: {
      ...mapState(['selectedYear', 'disasterData']),
      ...mapGetters(['dataByYear']),
    },
    watch: {
      selectedYear() {
        this.updateChart();
      },
    },
    methods: {
      ...mapMutations(['changeSelectedYear']),
      drawChart() {
        const svg = d3.select("#bar-chart").append("svg")
        .attr("width", this.svgWidth + this.svgPadding.left + this.svgPadding.right)
        .attr("height", this.svgHeight + this.svgPadding.top + this.svgPadding.bottom)
        .append("g")
        .attr("transform", `translate(${this.svgPadding.left}, ${this.svgPadding.top})`);

        svg.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${this.svgHeight})`);
        svg.append("g").attr("class", "y-axis");
        svg.append("g").attr("class", "bars");

        this.updateChart();
      },
      updateChart() {
        const data = this.dataByYear(this.selectedYear);
        const svg = d3.select("#bar-chart").select("svg");
        const x = d3.scaleBand().range([0, this.svgWidth]).padding(0.1);
        const y = d3.scaleLinear().range([this.svgHeight, 0]);

        x.domain(data.map(d => d.country));
        y.domain([0, d3.max(data, d => d.value)]);

        svg.select(".x-axis").call(d3.axisBottom(x));
        svg.select(".y-axis").call(d3.axisLeft(y));

        const bars = svg.select(".bars").selectAll("rect").data(data);

        bars.enter().append("rect")
            .merge(bars)
            .attr("x", d => x(d.country))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => this.svgHeight - y(d.value));

        bars.exit().remove();
        },
    },
    mounted() {
      this.drawChart();
    },
  };
  </script>
  
  <style scoped>
 #bar-chart rect {
  fill: steelblue;
  }
  </style>