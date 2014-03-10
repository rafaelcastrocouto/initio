var test_chart = function () {
  var el = $('<div class="chart">');
  $canvas.prepend(el);
  el.highcharts({
    title: { text: 'Test'+test_counter+' Chart'  },
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
        data: energy_data
      },{
        name: 'Minimum Energy',
        data: min_data,
        pointInterval: ((An + En)/100) + 3,
        pointStart: ((An + En)/100) + 2
  
      }
    ]
  })
};
var final_chart = function () {
  var el = $('<div class="container">');
  $results.prepend(el);
  el.highcharts({
    title: { text: 'Final Chart'  },
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
        name: 'Avarage Energy',
        data: avg_data
      },{
        name: 'Minimum Energy',
        data: final_data,
      }
    ]
  })
};