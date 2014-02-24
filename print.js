var final_chart = function () {
  var el = $('<div class="chart">');
  $canvas.prepend(el);
  el.highcharts({
    title: { text: 'AB Model Protein Folding'  },
    subtitle: { text: 'Estimated Learning Algorithm' },
    chart: {
      type: 'line',
      zoomType: 'xy'/*,
      events: {
        load: function(){
          //callback after chart is loaded
        }
      }*/
    },
    xAxis: {
        title: { text: 'Protein' }
    },
    yAxis: {
        title: { text: 'Energy' }     
    },
    series: [
      {
        name: 'Energy',
        data: e_data
      },{
        name: 'Minimum Energy',
        data: min_data,
        pointInterval: ((An + En)/100) + 3,
        pointStart: ((An + En)/100) + 2
  
      }
    ]
  })
};
