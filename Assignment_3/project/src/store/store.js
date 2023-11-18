import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: 2006,
    selectedStates: [],
    personaleIncome: [],
    baDegreeOrHigher: [],
    colorScale: ['#3b4994' , '#8c62aa','#be64ac', '#5698b9',
    '#a5add3', '#dfb0d6', '#5ac8c8', '#ace4e4', '#e8e8e8'],
    // ->similar to selected year
  },
  mutations: {
    changeSelectedYear (state, year) {
      state.selectedYear = year;
    },
    changeSelectedState(state, val) {
      state.selectedStates.push(val);
    }   
  },
  getters: {
    selectedYear: (state) => state.selectedYear,
    selectedStates: (state) => state.selectedStates,
    personaleIncome (state) {
      let result = [];
      for (let i = 0; i < state.personaleIncome.length; i++) {
        if (state.selectedYear in state.personaleIncome[i]) {
          result.push({
            state: state.personaleIncome[i].State,
            value: +state.personaleIncome[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    baDegreeOrHigher (state) {
      let result = [];
      for (let i = 0; i < state.baDegreeOrHigher.length; i++) {
        if (state.selectedYear in state.baDegreeOrHigher[i]) {
          result.push({
            state: state.baDegreeOrHigher[i].State,
            value: state.baDegreeOrHigher[i][state.selectedYear]
          })
        }
      }
      return result;
    },
    colorScale (state) {
      return state.colorScale;   
    },
  },
  actions: {
    loadData({state}) {
      d3.csv('./usa_personal-income-by-state_2006-2019.csv').then((data) => { 
        state.personaleIncome = data;
      })

      d3.csv('./usa_ba-degree-or-higher_2006-2019.csv').then((data) => { 
        state.baDegreeOrHigher = data;
      })
    },
  }
})

export default store;
