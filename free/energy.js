//var seq = "ABBABBABABBAB"
//var ang = [0, -1.49083, -1.50080, 0.87041, -1.48069, -1.51801, 1.46453, -1.95310, 1.44914, -1.51696, -1.48240, 1.04103, 0]
//console.log('energy: ', energy(seq, ang)) //-3,29
/*
this.C = function(i, j){ 
  if(i.seq == 'A' && j.seq == 'A') return 1
  if(i.seq == 'A' && j.seq == 'B'
  || i.seq == 'B' && j.seq == 'A') return -0.5
  if(i.seq == 'B' && j.seq == 'B') return 0.5
}

this.energy = function(protein){
  var aminos = protein.aminos
  var n = aminos.length

  var v1 = 0
  for (var i = 1; i < (n - 1); ++i) {
    v1 += (1 - Math.cos(aminos[i].ang))
  }

  var v2 = 0
  for (var i = 0; i < (n - 2); ++i) {
    for (var j = (i + 2); j < n; ++j) {
      var d = distance(aminos[i], aminos[j])
      v2 += ( Math.pow(d, -12) - C(aminos[i], aminos[j]) * Math.pow(d, -6))
    }
  }

  return ((1/4) * v1) + (4 * v2)
}
*/


this.CXY = function(i, j){ 
  if(i.seq == 'A' && j.seq == 'A') return 4
  if(i.seq == 'A' && j.seq == 'B'
  || i.seq == 'B' && j.seq == 'A') return 1
  if(i.seq == 'B' && j.seq == 'B') return 1
}

this.energyXY = function(protein){
  var te = {x: 0, y: 0}
  var aminos = protein.aminos
  for (var i = 0; i < aminos.length; ++i) {
    aminos[i].energy = {x: 0, y: 0}
    for (var j = 0; j < aminos.length; ++j) {
      if(i == j) continue
      var c = CXY(aminos[i], aminos[j])
      var d = distance(aminos[i], aminos[j]) / 2 + (c/10)
      var e = (Math.pow(d, 2) - Math.pow(d, -2)) * c   
      var x = aminos[i].x - aminos[j].x
      var y = aminos[i].y - aminos[j].y
      var a = Math.atan2(y, x)
      var ex = Math.cos(a) * e
      var ey = Math.sin(a) * e
      te.x += ex
      te.y += ey
      aminos[i].energy.x += ex
      aminos[i].energy.y += ey
    }
  }
  protein.energy = Math.pow( 
          Math.pow(ex, 2) + 
          Math.pow(ey, 2) , 0.5 )
  return protein.energy
}
