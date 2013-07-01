//estimated learning algorithm
var Ela = function(protein){
  var f_data = [0];
  var s_data = [protein.energy];
  var parameter = [];
  var initParameters = function(){
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i] = {
        softness: 1,
        efficiency: 0.5
      };
    } 
  };
  
  var adjustParameters = function(e0, e1, a){
    //TODO use e0 and e1 to adjust parameters
    for(var i = 0; i < a.length; ++i){
      // - softness
      parameter[a[i]].softness *= 0.9;
      if(parameter[a[i]].softness <= 0.01) parameter[a[i]].softness = 0.01;
      // + efficiency
      parameter[a[i]].efficiency += 0.1;
      if(parameter[a[i]].efficiency >= 1) parameter[a[i]].efficiency = 1;
    }
  }

  var delta = 2 * Math.PI;
  var randomAngles = function(p, a){ 
    var array = p.getAngle();
    for(var i = 0; i < a.length; ++i){
      var angle = a[i];
      array[angle] += delta * gaussRandom(parameter[angle].softness);
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
  var fc = 0;
  var bend = function(p){ 
    var a = chooseAngles(4);
    var new_p = new Protein({ang: randomAngles(p, a), seq: p.getSeq()});
    new_p.render(protein.context);
    
    if(new_p.energy < p.energy * 0.95) { //"success"
      adjustParameters(p.energy, new_p.energy, a);
      console.log('success', new_p.energy.toFixed(2), a);
      fc = 0;
      return new_p; 
      
    } else { //fail
      fc++;
      return p;
    }
  };

  var min_p = protein;
  var t = 0;
  var loop = function(){ 
    min_p = bend(min_p);
    min_p.render(protein.context);
    
    //TODO stop criteria
    ++t;
    
    if(t%10 == 0){
       f_data.push(fc);
       s_data.push(min_p.energy);
    }
    if(t < 1000) setTimeout(loop, 0);
    else chart(s_data, f_data)
  };
  
  initParameters();
  loop();

}
