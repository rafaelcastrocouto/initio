//estimated learning algorithm
var Ann = function(protein, ctx){
  //limit
  var _l = parseInt($('#A').val());
  
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
    ++t;    
    for(var i = 1; i < protein.length - 1; ++i){
      var a = new_p.getAngle();
      var na = newAngles(a[i]); //console.log(na)
      
      a[i] = na[0]; //console.log(a);
      new_p = new Protein({ang: a, seq: seq});
      //new_p.render(protein.context);
      new_p = test(new_p);
       
      a[i] = na[1]; //console.log(a);
      new_p = new Protein({ang: a, seq: seq});
      //new_p.render(protein.context);
      new_p = test(new_p);    
      
      new_p.render(ctx);
      
    }
    delta *= 0.9;

    if(t%100 == 0 && print_chart) pushToData(fail_count, min_p);
    
    if(t < _l) setTimeout(loop); 
    else {  //TODO stop criteria
      // PRINT
      min_p.render(ctx);
      console.log('success', min_p.energy.toFixed(2));
      if(print_chart) chart(ctx, f_data, e_data);
      $('#results').append($('<p>'+test_count+' Protein energy: '+min_p.energy+'</p>'));
      //repeat
      test_av(min_p);
    }
  };
  
  loop();

}


