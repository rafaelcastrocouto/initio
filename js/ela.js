importScripts('protein.js', 'utils.js', 'energy.js');

self.addEventListener('message', function(e) {
  var msg = JSON.parse(e.data);    
  Ela(
    msg.seq, 
    msg.ang, 
    msg.l, 
    msg.parameter, 
    msg.pop, 
    msg.parent, 
    msg.ang_num,
    msg.rigs,
    msg.rigf,
    msg.rigm,
    msg.rign,
    msg.rigx,
    msg.effs,
    msg.efff    
  );  
}, false);
/**
 * Estimated Learning Algorithm
 * @param {String} seq - String with the aminoacid's type sequence.
 * @param {Array} ang - The angle sequence in radians.
 * @param {int} l - The limit of loops (stop criteria).
 * @param {Object} parameter - The parameters object {rigidity: Array, efficiency: Array}.
 * @param {int} pop - The size of the population (number of solutions per loop).
 * @param {float} parent - The percentage of the population that will be reference to new solutions.
 * @param {int} ang_num - Number of angles changed per solution.
 * @param {string} rigs - The expression that changes rigidity on successes.
 * @param {string} rigf - The expression that changes rigidity on fails.
 * @param {float} rigm - Maximum value for rigidity.
 * @param {int} rign - Number of neightbors affected by rigidity.
 * @param {string} rigx - The expression that changes neightbors rigidity value.
 * @param {string} effs - The expression that changes efficiency on successes.
 * @param {string} efff - The expression that changes efficiency on fails.
 */
var Ela = function(seq, ang, l, parameter, pop, parent, ang_num, rigs, rigf, rigm, rign, rigx, effs, efff){  
  var n = 2;
  var min_p = new Protein({'seq': seq, 'ang': ang}); 
  
  var adjustParametersSuccess = function(p, e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    //var dif = e1 - e0;
    for(var i = 0; i < a.length; ++i){
      parameter[a[i]].rigidity = parameter[a[i]].rigidity + eval(rigs);
      if(parameter[a[i]].rigidity > rigm || parameter[a[i]].rigidity < 1) 
        parameter[a[i]].rigidity = 1;
      
      for(var n = 1; n <= rign; ++n){
        if(parameter[a[i] + n]){
          var x = parameter[a[i] + n].rigidity;
          parameter[a[i] + n].rigidity = x + eval(rigs) * eval(rigx); 
          if(parameter[a[i] + n].rigidity > rigm || parameter[a[i] + n].rigidity < 1) 
            parameter[a[i] + n].rigidity = 1;
        }
      }
      for(var n = 1; n <= rign; ++n){
        if(parameter[a[i] - n]){
          var x = parameter[a[i] - n].rigidity;
          parameter[a[i] - n].rigidity = x + eval(rigs) * eval(rigx);
          if(parameter[a[i] - n].rigidity > rigm || parameter[a[i] - n].rigidity < 1) 
            parameter[a[i] - n].rigidity = 1;
        }
      }      
      
      parameter[a[i]].efficiency = parameter[a[i]].efficiency + eval(effs); 
      if(parameter[a[i]].efficiency > seq.length || parameter[a[i]].efficiency < 1) 
        parameter[a[i]].efficiency = 1;     
    }
  };
  
  var adjustParametersFail = function(p, e0, e1, a){ 
    //TODO use e0 and e1 to adjust parameters
    //for(var i = 1; i < p.length - 1; ++i){
    for(var i = 0; i < a.length; ++i){      
      parameter[a[i]].rigidity = parameter[a[i]].rigidity + eval(rigf);
      if(parameter[a[i]].rigidity > rigm || parameter[a[i]].rigidity < 1) 
        parameter[a[i]].rigidity = 1;
      
       for(var n = 1; n <= rign; ++n){
        if(parameter[a[i] + n]){
          var x = parameter[a[i] + n].rigidity;
          parameter[a[i] + n].rigidity = x + eval(rigs) * eval(rigx);
          if(parameter[a[i] + n].rigidity > rigm || parameter[a[i] + n].rigidity < 1) 
            parameter[a[i] + n].rigidity = 1;
        }
      }
      for(var n = 1; n <= rign; ++n){
        if(parameter[a[i] - n]){
          var x = parameter[a[i] - n].rigidity;
          parameter[a[i] - n].rigidity = x + eval(rigs) * eval(rigx);
          if(parameter[a[i] - n].rigidity > rigm || parameter[a[i] - n].rigidity < 1) 
            parameter[a[i] - n].rigidity = 1;
        }
      } 
      
      parameter[a[i]].efficiency = parameter[a[i]].efficiency + eval(efff);        
      if (parameter[a[i]].efficiency > seq.length || parameter[a[i]].efficiency < 1) 
        parameter[a[i]].efficiency = 1;    
    }
  };  
  
  //ANGLES
  var delta = 2 * Math.PI; // 360 deg
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
    if(p.energy < min_p.energy) {
      adjustParametersSuccess(p, min_p.energy, p.energy, a);
      min_p = p;
    } else {
      adjustParametersFail(p, min_p.energy, p.energy, a);
    }
  };  
 
  //init popupation
  var population = [];
  for(var i = 0; i < pop * parent; ++i){
    population[i] = new Protein({'seq': seq, 'ang': ang});
  }

  //loop
  var t = 0;
  for(var t = 0; t < l; ++t){
    var newpop = [];    
    for(var i = 0; i < pop; ++i){
      var refp = population[parseInt(i * parent)];
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
