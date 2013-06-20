//estimated learning algorithm

var Ela = function(protein){
  
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
    if(e1 < e0){ //success
      parameter[a].softness *= 0.9;
      if(parameter[a].softness <= 0.01) parameter[a].softness = 0.01;
      
      parameter[a].efficiency += 0.01;
      if(parameter[a].efficiency >= 1) parameter[a].efficiency = 1;
      
    } else { //fail
      //parameter[a].efficiency *= 0.6;
    }
  }

  var randomAngle = function(p, a){ 
    var na = p.getAngle();
    //console.log(a, parameter)
    na[a] += 2 * Math.PI * gaussRandom(parameter[a].softness + 1E-10);
    //console.log('na: ', na);
    return na;
  };

  var bend = function(p){ 
    var a = chooseAngle();
    var npro = new Protein({ang: randomAngle(p, a), seq: p.getSeq()});
    npro.render();
    adjustParameters(p.energy, npro.energy, a);
    
    if(npro.energy < p.energy * 0.9) { 
       if(npro.energy < min) {
         min = npro.energy;
         console.log('success', min.toFixed(2), a);
       }
      return npro; 
    }
    //console.log('fail');
    return p;
  };

  var sum;
  var chooseAngle = function(){
    sum = 0;
    for(var i = 1; i < protein.length - 1; ++i){
      parameter[i].low = sum;
      sum += parameter[i].efficiency;
      parameter[i].up = sum;
    }
    var r = Math.random() * sum;
    for(var i = 1; i < protein.length - 1; ++i){
      if(parameter[i].low <= r && r < parameter[i].up) return i;
    }
    
  };
  var min = protein.energy;
  var minp = protein;
  var loop = function(){ 
    minp = bend(minp);
    minp.render();
    // stop sum > 1E-10
    if(true) setTimeout(loop, 0)
  };
  
  initParameters();
  loop();

}
