var chart = function (ctx, f_array, e_array, ne_array) {
  var el = $('<div class="chart">');
  if(ctx) el.insertAfter(ctx.canvas);
  else $('#canvas').prepend(el);
  el.highcharts({
    title: { text: 'AB Model Protein Folding'  },
    subtitle: { text: 'Estimated Learning Algorithm' },
    chart: {
        type: 'line',
        zoomType: 'xy',
        marginRight: 50,
        marginBottom: 100,
        events: {
            load: function(event) {
              this.series.forEach(function(d,i){if(i==1)d.hide()})
            }
          }       
    },
    xAxis: {
        title: { text: 'Steps/100' }
    },
    yAxis: [{
        title: { text: 'Energy' }  // 0     
    },      {
        title: { text: 'Fails' } // 1
    }],
    series: [
      {
        yAxis: 0,
        name: 'Energy',
        data: e_array
      }/*,{
        yAxis: 0,       
        name: 'Energy',
        data: ne_array
      }*/,{
        yAxis: 1,       
        name: 'Fails',
        data: f_array
      }
    ]/*,
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function(e) {
              if(this.marker && this.marker.p) 
                this.marker.p.render(ctx)
            }
          }
        }
      }
    }*/
  })
};
var final_chart = function (fe_array) {
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
        data: fe_array
      }
    ]
  })
};
