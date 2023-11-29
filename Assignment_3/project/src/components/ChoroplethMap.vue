<template>
  <div class="vis-component" ref="map">
    <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div>
    <!-- <div>
      <l-geo-json url="asset/us-states-geo.json"  ref="geolayer"></l-geo-json>
    </div> -->
    <!-- <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup"></g>
    </svg> -->
    <div ref="choropleth"></div>

  </div>
</template>

<script>
import * as d3 from 'd3';

import mapStatesUSA from '@/assets/us-states-geo.json';

export default {
  name: 'ChoroplethMap',
  props: {
  },
  data() {
    return {
      svgWidth: 700,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
    // Use the following map geoJSON object ("mapStatesUSA") for your projection
    this.drawMap();
  },
  methods: {
    handleFillColor(d) {
      const colorScale = d3.scaleQuantize()
        .range(['#3b4994', '#8c62aa', '#be64ac', '#5698b9',
          '#a5add3', '#dfb0d6', '#5ac8c8', '#ace4e4', '#e8e8e8']);
      const normalize = (value, min, max) => (value - min) / (max - min);
      const incomeExtent = d3.extent(this.mapData, d => d.income);
      const educationExtent = d3.extent(this.mapData, d => d.degree);

      colorScale.domain([
        normalize(incomeExtent[0], incomeExtent[0], incomeExtent[1]),
        normalize(incomeExtent[1], incomeExtent[0], incomeExtent[1]),
        normalize(educationExtent[0], educationExtent[0], educationExtent[1]),
        normalize(educationExtent[1], educationExtent[0], educationExtent[1]),
      ]);
      return colorScale(normalize(d.income, incomeExtent[0], incomeExtent[1]), normalize(d.degree, educationExtent[0], educationExtent[1]));

    },
    drawMap() {
      if (this.mapData.length === 0) return;
      // if (this.$refs.map) this.svgWidth = this.$refs.map.clientWidth;
      // d3.select(this.$refs.chartGroup)
      //   .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);

      const projection = d3.geoAlbersUsa()
        .scale([this.svgWidth * 1.25])
        .translate([this.svgWidth / 2, this.svgHeight / 2])

      const path = d3.geoPath().projection(projection)


      let svg = d3.select(this.$refs.choropleth).select('svg');

      // If the 'svg' element does not exist, append a new one
      if (svg.empty()) {
        svg = d3.select(this.$refs.choropleth)
          .append('svg')
          .attr('width', this.svgWidth)
          .attr('height', this.svgHeight);
      }

      let paths = svg.selectAll('path')
        .data(mapStatesUSA.features);
      
      paths.exit().remove();
     
      paths.attr('d', path)
      .data(this.mapData)
      .attr('fill', this.handleFillColor);

      
      paths.enter().append('path')
        .attr('d', path)
        .data(this.mapData)
        .attr('fill', this.handleFillColor)
      // .on('mouseover', function () {
      //   d3.select(this).style('stroke', 'red');
      // }).on('mouseout', function () {
      //   d3.select(this).style('stroke', 'black');
      // });

    }
  },
  computed: {
    personaleIncome: {
      get() {
        return this.$store.getters.personaleIncome;
      }
    },
    baDegreeOrHigher: {
      get() {
        return this.$store.getters.baDegreeOrHigher;
      }
    },
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      }
    },
    mapData: {
      get() {
        return this.$store.getters.mapData;
      }
    },
  },
  watch: {
    mapData: {
      handler() {
        this.drawMap();
      },
      deep: true,
    },
  },
}
</script>

<style></style>
