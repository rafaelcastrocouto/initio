importScripts('protein.js', 'utils.js', 'energy.js');

self.addEventListener('message', function(e) {
  var msg = JSON.parse(e.data);
  Ann(
    msg.seq, 
    msg.ang, 
    msg.l,
    msg.start,
    msg.delta
  );  
}, false);
/**
 * Algorithm inspired in Simulated Annealing
 * @param {String} seq - String with the aminoacid's type sequence.
 * @param {Array} ang - The angle sequence in radians.
 * @param {int} l - The limit of loops (stop criteria).
 * @param {float} start - The initial angle variation.
 * @param {float} delta - The angle variation "cool factor".
 */
var Ann = function(seq, ang, l, start, delta){
  
  var min_p = new Protein({'seq': seq, 'ang': ang});
  
  var newAngles = function(a){ 
    var array = [];
    array[0] = a + start;
    array[1] = a - start;
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
    
    start *= delta;

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


