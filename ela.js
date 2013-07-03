//estimated learning algorithm
var Ela = function(protein){
  
  //PARAMETERS  
  var parameter = [];
  
  var initParameters = function(){
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i] = {
        rigidity: 0,
        efficiency:  i / (protein.length - 1)
      };
    }
    //parameter[protein.length - 2].efficiency = 0;
    //parameter[protein.length - 3].efficiency = 0;
    //parameter[protein.length - 4].efficiency = 0;
    //parameter[protein.length - 5].efficiency = 0;
    //parameter[protein.length - 6].efficiency = 1;
  };
  
  var adjustParametersSuccess = function(e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    for(var i = 0; i < a.length; ++i){
      // + rigidity
      parameter[a[i]].rigidity *= 1.1;
      if(parameter[a[i]].rigidity > 1) parameter[a[i]].rigidity = 1;
      // - efficiency
      parameter[a[i]].efficiency *= 0.1;
      if(parameter[a[i]].efficiency < 0.01) parameter[a[i]].efficiency = 0.01;
    }
  };
  
  //ANGLES
  var delta = 2 * Math.PI;
  var randomAngles = function(p, a){ 
    var array = p.getAngle();
    for(var i = 0; i < a.length; ++i){
      var angle = a[i];
      array[angle] += delta * gaussRandom(1 - parameter[angle].rigidity);
    }
    return array;
  };

  var chooseAngles = function(n){
    var array = [], sum = 0;
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i].low = sum;
      sum += parameter[i].efficiency;
      parameter[i].up = sum;
    }
    for(var j = 0; j < n; ++j){
      var r = Math.random() * sum;
      for(var i = 1; i < protein.length - 1; ++i){
        if(parameter[i].low <= r && r < parameter[i].up) array.push(i);
      }
    }
    return array;
  };  
  var min_p = protein, new_p = protein, fail_count = 0;
  //TESTS
  /*var ang_c = (protein.length - 2) / 2;*/
  var bend = function(p){ 
    var a = chooseAngles(2/*Math.round(ang_c)*/);
    var new_p = new Protein({ang: randomAngles(p, a), seq: p.getSeq()});
    new_p.render(protein.context);
        
    if(new_p.energy < min_p.energy) { //success
      /*ang_c--;*/
      min_p = new_p;
      console.log('success', new_p.energy.toFixed(2), a);
      fail_count = 0;
    } else { //fail
      fail_count++;
    }
    
    if(new_p.energy < p.energy * 0.9) { //"success" 
      adjustParametersSuccess(p.energy, new_p.energy, a);
      return new_p; 
    } else { //fail
      return p;
    }    

  };
  
  //LOOP
  var f_data = [0], 
      e_data = [protein.energy], ne_data = [protein.energy], 
      p_data = [protein], np_data = [protein];
  var t = 0;
  var loop = function(){ 
    ++t;
    new_p = bend(new_p);
    new_p.render(protein.context);
    if(t%20 == 0){ //TODO stop criteria
      f_data.push(fail_count);
      e_data.push({y: min_p.energy, marker: { p: min_p }});
      ne_data.push({y: new_p.energy, marker: { p: new_p }});
    }
    if(t < 1000/*ang_c != 0*/) setTimeout(loop, 0);
    else {
      // PRINT
      min_p.render(protein.context);
      chart(f_data, e_data, ne_data);
    }
  };
  
  initParameters();
  loop();

}
