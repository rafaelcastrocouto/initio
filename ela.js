//estimated learning algorithm

this.Ela = function(protein){

  var n = Math.pow(protein.length, 2);
  var seq = protein.seq;
  var ang = protein.ang;
  var energy1 = protein.energy;
  
  var soft = [];
  for(var i = 1; i < protein.length - 1; ++i){
    soft[i] = 1;
  }

  console.log('n: ', n);
  console.log('enery1: ', energy1);
  
  var angle = 3;

  var randomAng = function(a, i){  
    var angDelta = Math.PI / angle;
    var clock = (Math.random() > 0.5 ? 1 : -1);
    var na = (a[i] + angDelta) * Math.random() * clock * (soft[i]);
      //console.log('na: ', na);
      a[i] = na;
      
    return a;
  }


  var bend = function(p){ 
    var min = p;
    for(var i = 1; i < p.length - 1; ++i){
      var pro1 = new Protein({'seq': seq, 'ang': randomAng(min.ang, i)});
      pro1.render();
      if(pro1.energy > min.energy) { //console.log('amino fail');
        //soft[i] = 1;
      } else { console.log('amino step');
        soft[i] *= 0.2;     
        min = pro1; 
      }
    }
    return min;
  };

  var newp;
  var p = new Protein({'seq': p, 'ang': ang});
  
  var optimize = function(){ 
    newp = bend(p);
    newp.render();
    if(newp.energy >= p.energy) { console.log('p fail');
      setTimeout(optimize, 0)
    } else { console.log('p step', newp.energy);
      p = newp;
      setTimeout(optimize, 0)
    }  
  };
  optimize();

}
