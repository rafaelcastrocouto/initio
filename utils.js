var canvas, context;

var createCanvas = function(w, h){
  if(!h) h = w;
  var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
  document.body.appendChild(canvas);
  return canvas;
};

var angToCoord = function(ang){
  var coord = [], x = 0, y = 0, g = 0, r = 1;
  for(var i = 0; i < ang.length; ++i){
    x += r * Math.cos(g);
    y += r * Math.sin(g);
    coord[i] = {x: x, y: y};
    g -= ang[i];
  };
  return coord;
}

var coordToAng = function(coord){
  var ang = [], x, y, g, a = 0;
  for(var i = 0; i < coord.length - 1; ++i){
  
    x = (coord[i + 1].x - coord[i].x);
    y = (coord[i + 1].y - coord[i].y);
    
    g = Math.atan2(y,x);

    ang[i] = a - g;
    a = g;

  }
  ang[coord.length - 1] = 0;
  return ang;
}

var fibonacciCache = ['A', 'B'];
var fibonacci = function(l){
  var f = fibonacciCache, i = 0;
  var fib = function(i){
    f[i] = f[i-2] + f[i-1];
    return f[i];
  };
  while(i <= l) {
    if(!f[i]){
      f[i] = fib(i);
    }
    ++i;
  };
  return f[l];
}

var gaussRandom = function(w){
  return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()))/(5/w);
}