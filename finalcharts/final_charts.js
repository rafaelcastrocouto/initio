var clabel = ['Random','Effciency','Rigidity','Annealing','ELA(rig+eff)','ELA+ANN'];

var cdata = [
  {
    name: 'Avarage',
    data: [-3.4534050033637866,-3.550610001673042,-3.6944933292364044,-3.6710363386700493,-3.682368219103561,-3.8292101087956554]
  },{
    name: 'Minimum',
    data: [-4.20815693956393,-4.920413508099887,-4.168202456757255,-4.688983877955886,-4.210793205568203,-4.137192941368571]
  }
];

var comp_chart = function () {
  var el = $('<div class="container">');
  $('#comp').prepend(el);
  el.highcharts({
    title: { text: 'Análise 1'  },
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
      title: { text: 'Parâmetros' },
      allowDecimals: false,
      labels: {
        formatter: function() {
          return clabel[this.value];
        }
      }
    },
    yAxis: {
      title: { text: 'Energia' }     
    },
    series: cdata
  })
};


/*var label = ['ACMC','nPERMis','STMD','HTS','CSA','Este trabalho'];

var data = [
  {
    name: 'Fibo6',
    data: [-3.2941,-3.2939,-3.2941,-3.2941,-3.2941,-3.27562491074513]
  },{
    name: 'Fibo7',
    data: [-6.1976,-6.1976,-6.198,-6.168,-6.198,-6.0578768984653]
  },{
    name: 'Fibo8',
    data: [-8.9749,-8.9749,-10.806,-10.806,-10.806,-9.23852675468751]
  },{
    name: 'Fibo9',
    data: [-18.5154,-18.5154,-18.9202,-19.257,-18.9269,-13.441023912647]
  },{
    name: '1AGT',
    data: [0,0,0,-23.0575,-17.3268,-23.2433303926769]
  },{
    name: '1AHO',
    data: [0,0,0,-22.7554,-14.9613,-21.7818222352442]
  }
];*/

var label = ['Fibo6','Fibo7','Fibo8','Fibo9','1AGT','1AHO'];

var data = [
  {
    name: 'ACMC',
    data: [-3.2941,-6.1976,-10.8060,-18.5154]
  },/*{
    name: 'nPERMis',
    data: [-3.2939,-6.1976,-8.9749,-18.5154]
  },*/{
    name: 'STMD',
    data: [-3.2941,-6.1980,-10.8060,-18.9202]
  },{
    name: 'HTS',
    data: [-3.2941,-6.1680,-10.8060,-19.257,-23.0575,-22.7554]
  },{
    name: 'CSA',
    data: [-3.2941,-6.1980,-10.8060,-18.9269]
  },{
    name: 'Este trabalho',
    data: [-3.27562491074513,-6.0578768984653,-9.23852675468751,-13.441023912647,-23.2433303926769,-21.7818222352442]
  }
];


var final_chart = function () {
  var el = $('<div class="container">');
  $('#final').prepend(el);
  el.highcharts({
    title: { text: 'Resultado Final'  },
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
      title: { text: 'Cadeia primária' },
      allowDecimals: false,
      labels: {
        formatter: function() {
          return label[this.value];
        }
      }
    },
    yAxis: {
      title: { text: 'Energia' }     
    },
    series: data
  })
};

$(function(){
  comp_chart();
  final_chart();
});