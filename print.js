var chart = function(s_array, f_array){
  $('#chart').highcharts({
    chart: {
        type: 'line',
        zoomType: 'xy',
        marginRight: 50,
        marginBottom: 50
    },
    title: {
        text: 'Protein Energy'
    },
    subtitle: {
        text: 'Estimated Learning Algorithm'
    },
    xAxis: {
        title: {
            text: 'Steps'
        },       
        tickInterval: 10
    },
    yAxis: [{
        title: {
            text: 'Energy'
        }      
    },      {
        title: {
            text: 'Fails'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }],
    series: [{
        yAxis: 0,
        name: 'Success',
        data: s_array
    },
             {
        yAxis: 1,       
        name: 'Fail',
        data: f_array
    }]
  });
};