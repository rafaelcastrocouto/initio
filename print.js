var final_chart = function () {
  var el = $('<div class="chart">');
  $('#canvas').prepend(el);
  el.highcharts({
    title: { text: 'AB Model Protein Folding'  },
    subtitle: { text: 'Estimated Learning Algorithm' },
    chart: {
        type: 'line',
        zoomType: 'xy',
        marginRight: 50,
        marginBottom: 100
    },
    xAxis: {
        title: { text: 'Protein' }
    },
    yAxis: {
        title: { text: 'Energy' }  // 0     
    },
    series: [
      {
        name: 'Energy',
        data: e_data
      }
    ]
  })
};
