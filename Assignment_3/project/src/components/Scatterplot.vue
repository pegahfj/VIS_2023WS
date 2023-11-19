<template>
  <div class="vis-component" ref="chart">
    <svg id="main-svg" :width="svgWidth" :height="svgHeight">
      <g class="scatter-plot" ref="scatterPlot">
        <g class="axis axis-x" ref="axisX"></g>
        <g class="axis axis-y" ref="axisY"></g>
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
        top: 30, right: 30, bottom: 30, left: 30,
      },
    }
  },
  mounted() {
    this.drawScatterPlot();

  },
  methods: {
    drawScatterPlot(){
      const colorScale = d3.scaleQuantize()
        .range(['#3b4994' , '#8c62aa','#be64ac', '#5698b9',
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

      var diagram = d3.select(this.$refs.scatterPlot)
        // .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
        
      var height = this.svgHeight - this.svgPadding.top - this.svgPadding.bottom;
      d3.select(this.$refs.axisX)
      .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(this.xScale))
        .append('text')
        .attr('y', 10)
        .attr('x', 0)
        .style('text-anchor', 'end')
        .text("Year");
 
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end') 
        .attr('fill', 'black')
        .text("Average Yearly Personal Income (in $)");
   
      diagram.selectAll('rect')
        .data(this.mapData)
        .enter().append('rect')
        .attr('x', d => this.xScale(d.income)) // Adjust rectangle position
        .attr('y', d => this.yScale(d.degree)) // Adjust rectangle position
        .attr('width', 10) // Adjust rectangle size
        .attr('height', 10) // Adjust rectangle size
        .attr('fill', d => colorScale(d.income, d.degree))
        .attr('opacity', 0.7); // Adjust rectangle opacity
      
        diagram.selectAll('circle')
        .data(this.mapData)
        .enter().append('circle')
        .attr('cx', d => this.xScale(d.income))
        .attr('cy', d => this.yScale(d.degree))
        .attr('r', 5)
        .style('fill', d => colorScale(d.income, d.degree))
        // .on('mouseover', function() {
        //   d3.select(this).style('stroke', 'red');
        // })
        // .on('mouseout', function() {
        //   d3.select(this).style('stroke', 'black');
        // });
    }
   
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
    mapData: {
      get() {
        return this.$store.getters.mapData;
      }
    },
    xScale() {
      const max = Math.max(
        d3.max(this.baDegreeOrHigher, (d) => d.value),61);
      return d3
        .scaleLinear()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right])
        .domain([0, max]);
    },
    yScale() {
      const max = Math.max(
        d3.max(this.personaleIncome, (d) => d.value),85000);
      return d3
        .scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([0, max]);
    },
  },
  watch: {
  },
}
</script>

<style>
</style>
