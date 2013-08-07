var chart = function (p, id, f_array, e_array, ne_array, str) {
  $(id).highcharts({
    title: { text: 'AB Model Protein Folding'  },
    subtitle: { text: str },
    chart: {
        type: 'line',
        zoomType: 'xy',
        marginRight: 50,
        marginBottom: 100       
    },
    xAxis: {
        title: { text: 'Steps' }
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
      },/*{
        yAxis: 0,       
        name: 'Energy',
        data: ne_array
      },{
        yAxis: 1,       
        name: 'Fails',
        data: f_array
      }*/
    ],
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function(e) {
              if(this.marker && this.marker.p) 
                this.marker.p.render(p.context)
            }
          }
        }
      }
    }
  })
};

  
  