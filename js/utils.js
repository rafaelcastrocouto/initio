/**
 * Converts AB model Angle sequences to Coordinates sequences
 * @param {Array} coord - Length of the desired sequence.
 */
var angToCoord = function(ang){
  var coord = [], x = 0, y = 0, g = 0, r = 1;
  for(var i = 0; i < ang.length; ++i){
    x += r * Math.cos(g);
    y += r * Math.sin(g);
    coord[i] = {x: x, y: y};
    g -= ang[i];
  };
  return coord;
};
/**
 * Converts AB model Coordinates sequences to Angle sequences
 * @param {Array} coord - Length of the desired sequence.
 */
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
};

var fibonacciCache = ['A', 'B'];
/**
 * Fibonacci sequence with AB Model
 * @param {Int} l - Length of the desired sequence.
 */
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
};
/**
 * Gaussian Random with polar method - Sheldon Ross (pp. 464, 6ed)
 * @param {String} e - Converts a Real Sequence to AB Model. A: [I, V, L, P, C, M, G] B: [D, E, F, H, K, N, Q, R, S, T, W, Y]
 */
var gaussRandom = function(mean, variance) {
  if (mean == undefined)
    mean = 0.0;
  if (variance == undefined)
    variance = 1.0;
  var V1, V2, S;
  do {
    var U1 = Math.random();
    var U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);

  X = Math.sqrt(-2 * Math.log(S) / S) * V1;
//Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
  X = mean + Math.sqrt(variance) * X;
//Y = mean + Math.sqrt(variance) * Y ;
  return X;
};
/**
 * Converts Real protein sequences to AB Model sequences - A: [I, V, L, P, C, M, G] B: [D, E, F, H, K, N, Q, R, S, T, W, Y]
 * @param {String} e - Converts a Real Sequence to AB Model.
 */
var realToAb = function(str){
  var real = str.split(''), ab = []; 
  for(var i = 0; i < real.length; ++i){
    switch(real[i]){ //A:  I, V, L, P, C, M, G        
      case 'A': case 'I': case 'V': case 'L': case 'P': case 'C': case 'M': case 'G':
        ab.push('A'); 
        break;        
      default: //B: D, E, F, H, K, N, Q, R, S, T, W, Y
        ab.push('B');       
    }  
  }
  return ab.join('');
};

if(!console) var console = {
  log: function(){ 
    var msg = JSON.stringify({log: arguments.join('')});
    self.postMessage(msg); 
  }
};
/**
 * Prints Error events to the debug console
 * @param {Error} e - Object with error degub info.
 */
var onError = function(e) {
  console.error(['Worker error: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''));
};