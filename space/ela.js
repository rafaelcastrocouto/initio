//estimated learning algorithm

var min = Infinity;
var max = -Infinity;
var best;

var generateGradient = function(){
  var grad = [], r = 1, g = 1, b = 1, p = 10000;
  for(var i = 0; i < 105; i++){
    if(i >= 1  && i < 15) r -= 0.0357;
    if(i >= 16 && i < 30) {
      r -= 0.0143;
      g -= 0.05;
    }
    if(i >= 31 && i < 45) {
      r -= 0.0071;
      g -= 0.0071;
      b -= 0.0357;
    }
    if(i >= 46 && i < 60) {
      r -= 0.0071;
      g += 0.0286;
      b -= 0.0286;
    }
    if(i >= 61 && i < 75) {
      r += 0.0286;
      g += 0.0286;
      b += 0.0286;
    }     
    if(i >= 76 && i < 90) {
      r += 0.0357;
      g = 1;
      b -= 0.0357;
    }   
    if(i >= 91) {
      r = 1;
      g -= 0.0714;
      b = 0;
    }   
    var c = {
      r: Math.round(r*p)/p, 
      g: Math.round(g*p)/p, 
      b: Math.round(b*p)/p
    };
    grad[i] = c;
  }
  return grad;
};

var gradColor = function(lim, v, grad){
  var da = 1;
  if(v < lim){
    var pv = v + Math.abs(min);
    var da = pv / (Math.abs(min) + lim);
  }
  
  var i = Math.round(da * 104);
  
  //console.log('i: ', i);
  
  var color = {
    r: Math.round(grad[i].r * 255),
    g: Math.round(grad[i].g * 255),
    b: Math.round(grad[i].b * 255)
  }
  return color;
};
/////////////////bar/////////////////

var drawBar = function(x, y, width, height, ctx, grad){
  var i = 0, j = grad.length-1;
  var h = (height/grad.length);
  while(i < grad.length){
    var c =  'rgb('+parseInt(grad[j].r * 255)+','+
                    parseInt(grad[j].g * 255)+','+
                    parseInt(grad[j].b * 255)+')';
    ctx.fillStyle = c;  
    ctx.fillRect(x, y + (i * h), width, h+1);  
    j--;
    i++;
  }
  ctx.strokeStyle = 'black'; 
  ctx.strokeRect(x, y, width, (105 * h)); 
};



var Ela = function(protein, prec){
  var pi = ~~(Math.PI*prec); 
  this.results = [];
  for(var i = 0; i <= 2 * pi; ++i){
    this.results[i] = [];
    for(var j = 0; j <= 2 * pi; ++j){
      var ang = [0, (i - pi)/prec, (j - pi)/prec, 0];
      var pro = new Protein({'seq': protein.seq, 'ang': ang})
      var ene = energy(pro);
      this.results[i][j] = ene;
      if(ene > max) max = ene;
      if(ene < min) {
        min = ene;
        best = pro;
      }  
    }
  }
  return this.results;
};

var print = function(array, lim, size){
  var canvas = createCanvas(800, 500);
  var ctx = canvas.getContext('2d');
  var grad = generateGradient();
  
  drawBar(750, 0, 50, 500, ctx, grad);
  
  //console.log('n: ', array.length);
  //console.log('max: ', max);
  pmax = max - min;
  //console.log('pmax: ', pmax)
  //console.log('min: ', min);
  
  for(var i = 0; i < array.length; ++i){ 
    for(var j = 0; j < array[i].length; ++j){ 
      var ene = array[i][j];
      var color = gradColor(lim, ene, grad);
      ctx.fillStyle = 'rgba('+color.r+','+
                              color.g+','+
                              color.b+',1)';
      ctx.fillRect(i * size, j * size, size, size);
    }
  }
};