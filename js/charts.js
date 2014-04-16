var test_chart = function () {
  var el = $('<div class="chart">');
  $canvas.prepend(el);
  el.highcharts({
    title: { text: 'Test'+(test_counter-1)+' Chart'  },
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
      title: { text: 'N Steps' },
      labels: {
        formatter: function() {
          return 'N '+ (this.value * 100);
        } 
      }
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
  if(final_data.length == 1) return;
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
      title: { text: 'Protein' },
      allowDecimals: false,
      labels: {
        formatter: function() {
          var testnum = this.value + 1;
          return '<a href="#Test_'+ testnum +'">Test '+ testnum +'</a>';
        }
      }
    },
    yAxis: {
      title: { text: 'Test' }     
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