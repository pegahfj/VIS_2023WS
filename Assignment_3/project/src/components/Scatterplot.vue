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
      svgWidth: 0,
      svgHeight: 500,
      svgPadding: {
        top: 25, right: 20, bottom: 70, left: 40,
      },
    }
  },
  mounted() {
    this.$refs.scatterPlot.style.width = this.width + 'px';
    this.$refs.scatterPlot.style.height = this.height + 'px';
    this.drawScatterPlot();

  },
  methods: {
    // handleFillColor(d) {
    //   const colorScale = d3.scaleQuantize()
    //     .range(['#3b4994', '#8c62aa', '#be64ac', '#5698b9',
    //       '#a5add3', '#dfb0d6', '#5ac8c8', '#ace4e4', '#e8e8e8']);
    //   const normalize = (value, min, max) => (value - min) / (max - min);
    //   const incomeExtent = d3.extent(this.mapData, d => d.income);
    //   const educationExtent = d3.extent(this.mapData, d => d.degree);

    //   colorScale.domain([
    //     normalize(incomeExtent[0], incomeExtent[0], incomeExtent[1]),
    //     normalize(incomeExtent[1], incomeExtent[0], incomeExtent[1]),
    //     normalize(educationExtent[0], educationExtent[0], educationExtent[1]),
    //     normalize(educationExtent[1], educationExtent[0], educationExtent[1]),
    //   ]);
    //   return colorScale(normalize(d.income, incomeExtent[0], incomeExtent[1]), normalize(d.degree, educationExtent[0], educationExtent[1]));

    // },
    handleFillColor(i) {
      const colorScale = d3.scaleQuantize()
      .domain([0, 8])
      .range([ '#be64ac', '#8c62aa', '#3b4994','#dfb0d6', '#a5add3', '#5698b9', '#e8e8e8', '#ace4e4', '#5ac8c8']);

      return colorScale(i);
    },
    
    drawScatterPlot(){
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      var diagram = d3.select(this.$refs.scatterPlot)
      .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);


      // .attr("width", this.svgWidth)
      // .attr("height", this.svgHeight)
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
   

      let rectangleWidth = (this.svgWidth - this.svgPadding.left - this.svgPadding.right) / 3;
      let rectangleHeight = (this.svgHeight - this.svgPadding.top - this.svgPadding.bottom) / 3;

      // Split this.mapData into 9 equal parts
      let data = [];
      for (let i = 0; i < 9; i++) {
        data.push(this.mapData.slice(i * this.mapData.length / 9, (i + 1) * this.mapData.length / 9));
      }

      // Calculate the average income and degree for each part
      let averages = data.map(part => {
        let totalIncome = 0, totalDegree = 0;
        for (let d of part) {
          totalIncome += d.income;
          totalDegree += d.degree;
        }
        return {income: totalIncome / part.length, degree: totalDegree / part.length};
      });

        diagram.selectAll('rect')
        .data(averages)
        .enter().append('rect')
        .attr('x', (_, i) => (i % 3) * rectangleWidth) // Adjust rectangle position
        .attr('y', (_, i) => Math.floor(i / 3) * rectangleHeight) // Adjust rectangle position
        .attr('width', rectangleWidth) // Adjust rectangle size
        .attr('height', rectangleHeight) // Adjust rectangle size
        .attr('fill', (_, i) => this.handleFillColor(i)) // Adjust fill color based on index
        .attr('opacity', 0.7); // Adjust rectangle opacity
      
        diagram.selectAll('circle')
        .data(this.mapData)
        .enter().append('circle')
        .attr('cx', d => this.xScale(d.degree))
        .attr('cy', d => this.yScale(d.income))
        .attr('r', 3)
        .style('fill','black')
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
    mapData: {
      handler() {
        this.drawScatterPlot();
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
svg {
  overflow: hidden; 
}
</style>
