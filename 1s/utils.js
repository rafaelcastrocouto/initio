this.canvas = document.createElement('canvas'); 
              document.body.appendChild(canvas);
this.canvas.width = document.width;
this.canvas.height = document.height;
this.canvas.scale = 50;
this.canvas.offset = 200;
this.context = canvas.getContext('2d');

this.angToCoord = function(ang){
  var coord = [], x = 0, y = 0, g = 0, r = 1;
  for(var i = 0; i < ang.length; ++i){
    x += r * Math.cos(g);
    y += r * Math.sin(g);
    coord[i] = {x: x, y: y};
    g -= ang[i];
  };
  return coord;
}

this.checkCoord = function(coord){
  var x = coord.x * canvas.scale + canvas.offset,
      y = coord.y * canvas.scale + canvas.offset;
  return (x > 0 && x < document.width && y > 0 && y < document.height);
}

this.distance = function(i, j){
  return Math.pow( 
          Math.pow((i.x - j.x), 2) + 
          Math.pow((i.y - j.y), 2), 
        0.5 );
}

this.coordToAng = function(coord){
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

this.checkAng = function(A){
  var c = 1;
  for(var a = 0; a < A.length; ++a){;
    if(A[a] < -Math.PI/2 || A[a]  > Math.PI/2) c = 0 ;
  };
  return c;
}

this.fibonacci = ['A', 'B'];
this.getFibonacci = function(l){
  var f = fibonacci, i = 0;
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