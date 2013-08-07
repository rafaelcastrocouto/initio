//estimated learning algorithm
var Ela = function(protein){
  
  //PARAMETERS  
  var parameter = [];
  
  var initParameters = function(){
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i] = {
        rigidity: 0,
        efficiency: (i / (protein.length - 1))
      };
    }
  };
  
  var adjustParametersSuccess = function(e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    for(var i = 0; i < a.length; ++i){
      // + rigidity
      parameter[a[i]].rigidity *= 1.1;
      if(parameter[a[i]].rigidity > 10) parameter[a[i]].rigidity = 10;
       
      // + efficiency
      parameter[a[i]].efficiency += 0.01;  
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
      var angle = a[i];
      array[angle] += delta * gaussRandom(1 - parameter[angle].rigidity);
    }
    return array;
  };

  var chooseAngles = function(n){
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
      new_p = protein, 
      fail_count = 0;
  
  //TESTS
  var test = function(p, a){ 
    if(p.energy < min_p.energy) { //real success
      adjustParametersSuccess(min_p.energy, p.energy, a);
      min_p = p;
      console.log('success', min_p.energy.toFixed(2), a);
      fail_count = 0; 
    } else { //fail
      fail_count++;
    }
    
    if(p.energy < min_p.energy * 0.9) { //"success" 
      return p; 
    } else { //fail
      return min_p;
    }    

  };
  
  //DATA
  var f_data = [0], 
      e_data = [protein.energy], ne_data = [protein.energy], 
      p_data = [protein], np_data = [protein];
  var pushToData = function(){
    f_data.push(fail_count);
    e_data.push({y: min_p.energy, marker: { p: min_p }});
    ne_data.push({y: new_p.energy, marker: { p: new_p }});  
  };
  
  //LOOP
  var t = 0;
  
  var loop = function(){ 
    ++t;
    var a = chooseAngles(3);
    new_p = new Protein({ang: randomGauss(new_p, a), seq: protein.getSeq()});
    new_p.render(protein.context);
    new_p = test(new_p, a);
    
    if(t%20 == 0) pushToData();

    //if(t < 1000) setTimeout(loop); 
    else {  //TODO stop criteria
      // PRINT
      min_p.render(protein.context);
      chart(f_data, e_data, ne_data);
    }
  };
  
  initParameters();
  loop();

}
