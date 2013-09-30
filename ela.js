//estimated learning algorithm
var Ela = function(protein){
  
  //PARAMETERS  
  var parameter = [];
  
  var initParameters = function(){
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i] = {};
      parameter[i].rigidity = 0;
      parameter[i].efficiency = 1;
    }
  };
  
  var adjustParametersSuccess = function(p, e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    for(var i = 0; i < a.length; ++i){
      // + rigidity
      parameter[a[i]].rigidity += 1.1;
      if(parameter[a[i]].rigidity > 10) parameter[a[i]].rigidity = 0;
       
      // + efficiency
      parameter[a[i]].efficiency += 0.1;  
      if (parameter[a[i]].efficiency > 10) parameter[a[i]].efficiency = 1;  
      /*
      // - efficiency
      parameter[a[i]].efficiency *= 0.5;
      if(parameter[a[i]].efficiency < 0.001) parameter[a[i]].efficiency = 0.001;
      */
    }
  };
  
  //ANGLES
  var delta = 2 * Math.PI;
  var randomGauss = function(p, a){ 
    var array = p.getAngle();
    for(var i = 0; i < a.length; ++i){
      array[a[i]] += delta * gaussRandom(1 - parameter[a[i]].rigidity);
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
  
  //GLOBALS
  var min_p = protein,
      fail_count = 0;
  
  //TESTS
  var adjustParameters = function(p, a){ 
    if(p.energy < min_p.energy) { //real success
      adjustParametersSuccess(p, min_p.energy, p.energy, a);
      min_p = p;
      fail_count = 0; 
    } else { //fail
      fail_count++;
    }

  };
  
  //DATA
  var f_data = [0], 
      e_data = [protein.energy], ne_data = [protein.energy], 
      p_data = [protein], np_data = [protein];
  var pushToData = function(){
    f_data.push(fail_count);
    e_data.push({y: min_p.energy, marker: { p: min_p }});
    ne_data.push({y: population[0].energy, marker: { p: population[0] }});  
  };
  
  //LOOP
  var t = 0;
  var max_population = 100;
  var population = [];
  var bestpop = 0.1;
  for(var i = 0; i < max_population * bestpop; ++i){
    population[i] = protein;
  }
  console.log(population);
  var loop = function(){ 
    ++t;
    var newpop = [];
    for(var i = 0; i < max_population; ++i){
      var refp = population[parseInt(i * bestpop)];
      var a = chooseAngles(refp, 4);
      var p = new Protein({
        ang: randomGauss(refp, a), 
        seq: protein.getSeq()
      });
      adjustParameters(p, a);
      newpop[i] = p;
    }
    population = newpop;
    
    population.sort(function(a,b){
      return a.energy - b.energy;
    });
    
    min_p.render(protein.context);
    
    if(t%10 == 0) pushToData();

    if(t < 1000) setTimeout(loop); 
    else {  //TODO stop criteria
      // PRINT
      min_p.render(protein.context);
      chart(f_data, e_data, ne_data);
    }
  };
  
  initParameters();
  loop();

}
