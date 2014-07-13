//estimated learning algorithm
var Ann = function(protein, id){
  
  
  //ANGLES
  var delta = Math.PI / 3;
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
    if(p.energy < min_p.energy) { //real success
      min_p = p;
      console.log('success', min_p.energy.toFixed(2));
      
      fail_count = 0; 
      return p; 
    } else { //fail
      fail_count++;
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
  pushToData();
  //LOOP
  var t = 0;
  
  var loop = function(){ 
    ++t;
    var seq = protein.getSeq();
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
      
      new_p.render(protein.context);
      
    }
    delta *= 0.9;
    if(t%10 == 0) pushToData();

    if(t < 100) setTimeout(loop); 
    else {  //TODO stop criteria
      // PRINT
      min_p.render(protein.context);
      chart(protein, id, f_data, e_data, ne_data, 'Simmulated Annealing Algorithm');
    }
  };
  
  loop();

}

var seq = "ABBABBABABBAB";
//var ang = [0, -1.49083, -1.50080, 0.87041, -1.48069, -1.51801, 1.46453, -1.95310, 1.44914, -1.51696, -1.48240, 1.04103, 0];
var v = 1.1;    
var ang1 = [0, -1*v, -1*v, v, -1*v, -1*v, v, -1*v, v, -1*v, -1*v, v, 0];
var v = 1.5;
var ang2 = [0, -1*v, -1*v, v, -1*v, -1*v, v, -1*v, v, -1*v, -1*v, v, 0];

var protein1 = new Protein({'seq': seq, 'ang': ang1}, '#sim1');
var protein2 = new Protein({'seq': seq, 'ang': ang2}, '#sim2');
    
protein1.render();
protein2.render();

$('#simBt1').on('click',function(){
  Ann(protein1, '#chart1');
});
$('#simBt2').on('click',function(){
  Ann(protein2, '#chart2');
});


