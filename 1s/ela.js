//estimated learning algorithm



this.Ela = function(protein){

  var n = Math.pow(protein.length, 2);
  var p = new Protein({'seq': protein.seq, 'ang': protein.ang});
  var energy1 = protein.energy;

  console.log('n: ', n);
  console.log('enery1: ', energy1);
  
  var angle = 6;
  var adjust = 1;

  var randomAng = function(a, i){  
    var angDelta = Math.PI / angle;
    var clock = (Math.random() > 0.5 ? 1 : -1);
    var na = (a[i] + angDelta) * Math.random() * clock;
    //var ra = na - a[i-1];
    //var lim = Math.PI;
    //if(ra > -lim && ra < lim)+++++++
      a[i] = na;
    //console.log('n[i]: ', n[i]);
    return a;
  }
  var adjacentAng = function(a, i){  
    var angDelta = Math.PI / angle;
    var clock = (Math.random() > 0.5 ? 1 : -1);
    var na = a[i] + (angDelta * Math.random()) * clock;
    //var ra = na - a[i-1];
    //var lim = Math.PI;
    //if(ra > -lim && ra < lim)
      a[i] = na;
    //console.log('n[i]: ', n[i]);
    return a;
  }

  var bend = function(p, h){ 
    var min = p;
    for(var i = 1; i < p.length - 1; ++i){
      if(h) var pro1 = new Protein({'seq': p.seq, 'ang': adjacentAng(min.ang, i)});
      else var pro1 = new Protein({'seq': p.seq, 'ang': randomAng(min.ang, i)});
      pro1.render();
      if(pro1.energy < min.energy) {
        min = pro1; 
        console.log('pro1: ', pro1.energy);
      }
    }
    return min;
  };

  var newp, op = false;
  var optimize = function(){ 
    newp = bend(p, op);
    newp.render();
    if(newp.energy >= p.energy) { console.log('>: ');
      adjust *= 1.001;
      angle = (Math.random() * adjust) + (adjust / 2);
      setTimeout(optimize, 0)
    } else { console.log('<: ');
      p = newp; op = true;
      setTimeout(optimize, 0)
      console.log('optimize: ', p.energy);
    }  
  };
  optimize();

}
