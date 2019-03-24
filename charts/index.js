'use strict';

const root = document.getElementById('root');
let width = document.documentElement.clientWidth - 50;
if (width > 800) width = 800;

const view = {
  mainChart: {
    width,
    height: 350,
    strokeWidth: 2,
  },
  chartMap: {
    width,
    height: 50,
    strokeWidth: 1.3,
    thumb: {
      days: 24,
      minDays: 24,
      minWidth: 70,
      width: 100,
      right: 0,
    },
  },
  timeScale: {
    width,
    height: 40,
  }
}

function init(chartData) {
  console.log(chartData);
  chartData.forEach((data, index) => {
    const chart = new Chart({ data, index, view });
    root.append(chart.getElement());
  });
}
