importScripts('protein.js', 'utils.js', 'energy.js');

self.addEventListener('message', function(e) {
  var msg = JSON.parse(e.data);
  Ann(msg.seq, msg.ang, msg.l);  
}, false);

var Ann = function(seq, ang, l){
  
  var protein = new Protein({'seq': seq, 'ang': ang});
  
  //ANGLES
  var delta = Math.PI / 2;
  var newAngles = function(a){ 
    var array = [];
    array[0] = a + delta;
    array[1] = a - delta;
    return array;
  }; 
  
  //GLOBALS
  var min_p = protein, 
      new_p = protein, 
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

  //LOOP
  var t = 0;
  var seq = protein.getSeq();
  var loop = function(){ 
    ++t;  //pr_in.val( (++Prog / Tprog).toFixed(2)+'%');
    for(var i = 1; i < protein.length - 1; ++i){
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

    //if(t%100 == 0) min_p.data = pushToData(min_p, fail_count);
    
    if(t < l) loop(); 
    else {  //TODO stop criteria      
      //console.log('success', min_p.energy.toFixed(2));
      //$('#results').append($('<p>'+test_count+' Protein energy: '+min_p.energy+'</p>'));
      //fe_array.push(min_p.energy);   
      //test_av(min_p);
      var msg = JSON.stringify({
        ang: min_p.getAngle(), 
        energy: min_p.energy
      });
      self.postMessage(msg);
    }
  };
  //start looping
  loop();

}


