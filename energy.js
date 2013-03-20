//var seq = "ABBABBABABBAB"
//var ang = [0, -1.49083, -1.50080, 0.87041, -1.48069, -1.51801, 1.46453, -1.95310, 1.44914, -1.51696, -1.48240, 1.04103, 0]
//var energy = -3,29

angToCoord = function(ang){
  var coord = [], x = 0, y = 0, g = 0, r = 1
  for(var i = 0; i < ang.length; ++i){
    x += r * Math.cos(g)
    y += r * Math.sin(g)
    coord[i] = {x: x, y: y}
    g -= ang[i]
  }
  return coord
}


distance = function(i, j){
  return Math.pow( 
          Math.pow(Math.abs(i.x - j.x), 2) + 
          Math.pow(Math.abs(i.y - j.y), 2) , 0.5 )
}

coordToAng = function(coord){
  var ang = [], x, y, g, a = 0
  for(var i = 0; i < coord.length - 1; ++i){
  
    x = (coord[i + 1].x - coord[i].x)
    y = (coord[i + 1].y - coord[i].y)
    
    g = Math.atan2(y,x)

    ang[i] = a - g
    a = g

  } 
  ang[coord.length - 1] = 0
  return ang
}


C = function(i, j){ 
  if(i == 'A' && j == 'A') return 1
  if(i == 'A' && j == 'B'
  || i == 'B' && j == 'A') return -0.5
  if(i == 'B' && j == 'B') return 0.5
}

energy = function(protein){
  var n = protein.seq.length

  var v1 = 0
  for (var i = 1; i < (n - 1); ++i) {
    v1 += (1 - Math.cos(protein.ang[i]))
  }

  var xy = angToCoord(protein.ang)

  var v2 = 0
  for (var i = 0; i < (n - 2); ++i) {
    for (var j = (i + 2); j < n; ++j) {
      var d = distance(xy[i], xy[j])
      v2 += ( Math.pow(d, -12) - C(protein.seq[i], protein.seq[j]) * Math.pow(d, -6))
    }
  }

  return ((1/4) * v1) + (4 * v2)
}
