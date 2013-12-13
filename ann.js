importScripts('protein.js', 'utils.js', 'energy.js');

self.addEventListener('message', function(e) {
  var msg = JSON.parse(e.data);
  Ann(msg.seq, msg.ang, msg.l);  
}, false);

var Ann = function(seq, ang, l){
  
  var min_p = new Protein({'seq': seq, 'ang': ang});
  
  //ANGLES
  var delta = Math.PI / 2;
  var newAngles = function(a){ 
    var array = [];
    array[0] = a + delta;
    array[1] = a - delta;
    return array;
  }; 
  
  //GLOBALS
  var new_p = min_p, 
      fail_count = 0;
  
  //TESTS
  var test = function(p){ 
    if(p.energy < min_p.energy) {
      min_p = p;      
      fail_count = 0; 
      return p; 
    } else { //fail
      fail_count++;
      return min_p;
    }  
  };

  //loop
  var t = 0;

  for(var t = 0; t < l; ++t){
    
    for(var i = 1; i < min_p.length - 1; ++i){
      var a = new_p.getAngle();
      var na = newAngles(a[i]); 
      
      a[i] = na[0]; 
      new_p = new Protein({ang: a, seq: seq});  
      new_p = test(new_p);     
      
      a[i] = na[1];
      new_p = new Protein({ang: a, seq: seq});
      new_p = test(new_p);    
      
    }
    
    delta *= 0.9;

    if(t%100 == 0) {
      var msg = JSON.stringify({
        data: min_p.energy, 
      });
      self.postMessage(msg);      
    }

  };
  
  var msg = JSON.stringify({
    ang: min_p.getAngle(), 
    energy: min_p.energy
  });
  self.postMessage(msg);
}


