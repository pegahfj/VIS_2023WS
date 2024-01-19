import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2013,
    selectedCountry: [],
    totDisaster: [],

  },
  mutations: {
    changeSelectedYear (state, year) {
      state.selectedYear = year;
    },
    changeSelectedCountry(state, val) {
      // state.selectedCountry.push(val);
      state.selectedCountry = val;
    }   
  },
  getters: {
    selectedYear: (state) => state.selectedYear,
    selectedStates: (state) => state.selectedCountry,
    totDisaster (state) {
      let result = [];
      // console.log("getterstotDisaster:year:",state.selectedYear);
      for (let i = 0; i < state.totDisaster.length; i++) {
        // console.log("getterstotDisaster:Country:", state.totDisaster[i].Country);
        if (state.selectedYear in state.totDisaster[i]) {
          // console.log("getterstotDisaster:value: ",  state.totDisaster[i][state.selectedYear]);
          result.push({
            country: state.totDisaster[i].Country,
            value: +state.totDisaster[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    // baDegreeOrHigher (state) {
    //   let result = [];
    //   for (let i = 0; i < state.baDegreeOrHigher.length; i++) {
    //     if (state.selectedYear in state.baDegreeOrHigher[i]) {
    //       result.push({
    //         state: state.baDegreeOrHigher[i].State,
    //         value: state.baDegreeOrHigher[i][state.selectedYear]
    //       })
    //     }
    //   }
    //   return result;
    // },
  },
  actions: {
    loadData({state}) {
      d3.csv('./Filtered_Disasters_Total.csv').then((data) => { 
        // console.log("loadData({state}:  data:", data[4]['2014']);

        state.totDisaster = data;
      })

      // d3.csv('./usa_ba-degree-or-higher_2006-2019.csv').then((data) => { 
      //   state.baDegreeOrHigher = data;
      // })
    },
  }
})

export default store;
