<template>
  <div class="vis-component" ref="map">
    <svg id="main-svg" :width="svgWidth" :height="svgHeight">

    <g ref="choropleth"></g>
    <!-- <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div>
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
    </svg> -->
  </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
// import worldData from '@/assets/world.json'; 

export default {
  name: 'ChoroplethMap',
  props: {},
  data() {
    return {
      svgWidth: 700,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      
      colorScale: d3.scaleQuantize().range(['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#91003f']),
    };
  },
  mounted() {
    this.drawChoroplethMap();
  },
  methods: {
    drawChoroplethMap() {
      const svg = d3.select(this.$refs.choroplethMap)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight);

      const projection = d3.geoMercator()
        .scale(120)
        .translate([this.svgWidth / 2, this.svgHeight / 2]);

      const path = d3.geoPath().projection(projection);

      // Load GeoJSON data
      d3.json( "@/assets/world.json").then((world) => {
        // Assume your GeoJSON file has a property called 'value' for choropleth coloring
        // this.colorScale.domain([0, d3.max(world.features, d => d.properties.value)]);

        svg.selectAll('path')
          .data(world.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', 'steelblue');

          // .attr('fill', d => this.colorScale(d.properties.value));
      });
    },
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
  },
  watch: {
  },
}
</script>

<style>
</style>
