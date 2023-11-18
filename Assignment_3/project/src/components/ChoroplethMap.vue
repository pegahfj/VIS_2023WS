<template>
  <div class="vis-component" ref="map">
    <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div>
    <!-- <div>
      <l-geo-json url="asset/us-states-geo.json"  ref="geolayer"></l-geo-json>
    </div> -->
    <svg class="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="chart-group" ref="chartGroup"></g>
    </svg>
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
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20, right: 20, bottom: 20, left: 20,
      },
    }
  },
  mounted() {
    // Use the following map geoJSON object ("mapStatesUSA") for your projection
    this.drawMap(mapStatesUSA);
    console.log("mapStatesUSA: ");
    console.log(mapStatesUSA);
  },
  methods: {
    // use albersusa map projection to draw the map
    drawMap(mapStatesUSA){
      // if (this.$refs.map) this.svgWidth = this.$refs.map.clientWidth;
      d3.select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
   
      var projection = d3.geoAlbersUsa()
          .scale([this.svgWidth * 1.25])
          .translate([this.svgWidth / 2, this.svgHeight / 2])

      var path = d3.geoPath().projection(projection)
      
      // var colorScale = d3.scaleOrdinal().range(this.colorScale);
      console.log(this.colorScale)
     
      var svg = d3.select('#map')
          .append('svg')
          .attr('width', this.svgWidth)
          .attr('height', this.svgHeight)

          // paths -> shape of each state 
          // features-> our mapStateUSa more or less

      svg.selectAll('path')
          .data(mapStatesUSA.features) 
          .enter().append('path')
          .attr('d', path)
          .attr('fill', "3b4994")
          .on('mouseover', function() {
    d3.select(this).style('stroke', 'red');
  }).on('mouseout', function() {
    d3.select(this).style('stroke', 'black');
  });

      // return function update(data) {
      //     svg.selectAll('path')
      //         .data(data, function (d) { return d.name || d.properties.name })
      //         .style('fill', function (d) { return d.filtered ? '#ddd' : color(d.obesity) })
      // }
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
    colorScale() {
      return this.$store.getters.colorScale;
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
