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
    for(var i = 0; i < a.length; ++i){
      // + rigidity
      parameter[a[i]].rigidity += 10;
      if(parameter[a[i]].rigidity > 100) parameter[a[i]].rigidity = 1;

      // - efficiency
      parameter[a[i]].efficiency *= 0.5;  
      if (parameter[a[i]].efficienacy < 1) parameter[a[i]].efficiency = 1;  
    }
  };
  
  var adjustParametersFail = function(p, e0, e1, a){ 
    //TODO use e0 and e1 to adjust parameters
    for(var i = 1; i < p.length - 1; ++i){
      // - rigidity
      parameter[i].rigidity -= 0.0001;
      if(parameter[i].rigidity < 1) parameter[i].rigidity = 1;
      
      // + efficiency
      parameter[i].efficiency += 0.001;  
      if (parameter[i].efficiency > 100) parameter[i].efficiency = 100;         

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
  
  var t = 0;
  var max_population = 100;
  var population = [];
  var bestpop = 0.1;
  
  //init popupation
  for(var i = 0; i < max_population * bestpop; ++i){
    population[i] = new Protein({'seq': seq, 'ang': ang});
  }
  
  var loop = function(){ 
    ++t; //pr_in.val( (++Prog /Tprog).toFixed(2)+'%');
    var newpop = [];
    
    for(var i = 0; i < max_population; ++i){
      var refp = population[parseInt(i * bestpop)];
      var a = chooseAngles(refp, 4);  
      //var id = get_id(a);
      //if(cache[id]) {
      //  setTimeout(loop); 
      //  return false;
      //} else {
      
        var p = new Protein({
          ang: randomGauss(refp, a), 
          seq: seq
        });
      
        //to_cache(p);
      //}
      adjustParameters(p, a);
      newpop[i] = p;
    }   
    
    population = newpop;
    
    population.sort(function(a, b){
      return a.energy - b.energy;
    });
    //if(t%100 == 0) pushToData(min_p, fail_count);
    
    if(t < l) loop(); 
    else {
      //printParameters();
      //var Al = parseInt($('#A').val());
      //Ann(min_p, Al); 
      var msg = JSON.stringify({
        energy: min_p.energy, 
        ang: min_p.getAngle(), 
        parameter: parameter
      });
      self.postMessage(msg);
    }
  };
  //start looping
  loop();

}

/*var cache = {};

var get_id = function(a){ 
  var id = '';
  for(var i = 0; i < a.length; ++i){
    id += a[i].toFixed(1)+',';
  }
  return id;  
};

var to_cache = function(p){
  var id = get_id(p.getAngle());
  if(!cache[id]) cache[id] = p;
};

var global_parameter = [];
var gpi = false; //global_parameter initialized
*/
