importScripts('protein.js', 'utils.js', 'energy.js');

self.addEventListener('message', function(e) {
  var msg = JSON.parse(e.data);    
  Ela(msg.seq, msg.ang, msg.l, msg.parameter);  
}, false);

var Ela = function(seq, ang, l, parameter){  
  //almost GLOBALS
  var min_p = new Protein({'seq': seq, 'ang': ang}); 
  fail_count = 0;
  
  var adjustParametersSuccess = function(p, e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    var dif = e1 - e0;
    for(var i = 0; i < a.length; ++i){
      
      // + rigidity
      parameter[a[i]].rigidity += 10;
      if(parameter[a[i]].rigidity > 31) {
        parameter[a[i]].rigidity = 1;
        parameter[a[i]].efficiency = 1;
      }
      
      // + efficiency
      parameter[a[i]].efficiency += 0.5;  
      if(parameter[a[i]].efficiency > seq.length) parameter[a[i]].efficiency = 1;
             
    }
  };
  
  var adjustParametersFail = function(p, e0, e1, a){ 
    //TODO use e0 and e1 to adjust parameters
    //for(var i = 1; i < p.length - 1; ++i){
    for(var i = 0; i < a.length; ++i){
      // - rigidity
      parameter[a[i]].rigidity -= 0.00001;
      if(parameter[a[i]].rigidity < 1) parameter[a[i]].rigidity = 1;
      
      // - efficiency
      parameter[a[i]].efficiency -= 0.000001;        
      if (parameter[a[i]].efficiency < 1) parameter[a[i]].efficiency = 1;    
      
    }
  };  
  
  //ANGLES
  var delta = 2 * Math.PI;
  var randomGauss = function(p, a){ 
    var array = p.getAngle(); 
    for(var i = 0; i < a.length; ++i){
      array[a[i]] += delta * gaussRandom(0, 1/parameter[a[i]].rigidity);
    } 
    return array; 
  };
  
  var chooseAngles = function(p, n){
    var array = [], pa = parameter.slice();
    for(var i = 1; i < pa.length; ++i){
      pa[i].i = i;
    }
    var sumpick = function(){ 
      var sum = 0;
      for(var i = 1; i < pa.length; ++i){
        pa[i].low = sum;
        sum += pa[i].efficiency;
        pa[i].up = sum;
      }   
      var r = Math.random() * sum;
      for(var i = 1; i < pa.length; ++i){
        if(pa[i].low <= r && r < pa[i].up) {
          array.push(pa[i].i);
          pa.splice(i, 1);
          return;
        }
      }
    }
    var c = 0;
    while(c < n){ 
      sumpick();
      c++;
    }
    return array;
  };  
  
  //TESTS
  var adjustParameters = function(p, a){ 
    if(p.energy < min_p.energy) { //real success
      adjustParametersSuccess(p, min_p.energy, p.energy, a);
      min_p = p;
      fail_count = 0; 
    } else { //fail
      adjustParametersFail(p, min_p.energy, p.energy, a);
      fail_count++;
    }
  };  
  
  var max_population = 200;
  var bestpop = 0.25;
  var ang_num = 2;  
  
  //init popupation
  var population = [];
  for(var i = 0; i < max_population * bestpop; ++i){
    population[i] = new Protein({'seq': seq, 'ang': ang});
  }
  
  //loop
  var t = 0;
  for(var t = 0; t < l; ++t){
    var newpop = [];    
    for(var i = 0; i < max_population; ++i){
      var refp = population[parseInt(i * bestpop)];
      var a = chooseAngles(refp, ang_num );  
      
      var p = new Protein({
        ang: randomGauss(refp, a), 
        seq: seq
      });

      adjustParameters(p, a);
      newpop.push(p);
    }   
    
    population = newpop;
    
    population.sort(function(a, b){
      return a.energy - b.energy;
    });
    if(t%100 == 0) {
      
      var msg = JSON.stringify({
        data: min_p.energy, 
        parameter: parameter
      });
      self.postMessage(msg);      
    }
  }
  
  var msg = JSON.stringify({
    energy: min_p.energy, 
    ang: min_p.getAngle(), 
    parameter: parameter
  });
  self.postMessage(msg);
  
};
