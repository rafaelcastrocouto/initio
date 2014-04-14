//estimated learning algorithm

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
    var pv = v + Math.abs(min.energy);
    var da = pv / (Math.abs(min.energy) + lim);
  }
  
  var i = Math.round(da * 104);
  
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

var min = {energy: Infinity}, max = {energy: -Infinity};

var Ela = function(protein, prec){
  protein.x = 0; protein.y = 0;
  min = protein, max = protein;
  var pi = ~~(Math.PI*prec); 
  this.results = [];
  var x = 0, y = 0;
  for(var i = 0; i <= 2 * pi; ++i){y = 0;
    this.results[i] = [];
    for(var j = 0; j <= 2 * pi; ++j){
      var ang = [0, (i - pi)/prec, (j - pi)/prec, 0];
      var pro = new Protein({'seq': protein.seq, 'ang': ang})
      //var ene = energy(pro);
      this.results[i][j] = pro.energy;
      if(pro.energy > max.energy) {
        max = pro;
        max.x = x;
        max.y = y;
      }
      if(pro.energy < min.energy) {
        min = pro;
        min.x = x;
        min.y = y;
      }  
      ++y;
    }
    ++x;
  }
  return {results: this.results, max: max, min: min};
};

var print = function(array, lim, size, pro){
  var canvas = createCanvas(550, 500);
  var ctx = canvas.getContext('2d');
  var grad = generateGradient();
  
  drawBar(501, 0, 50, 500, ctx, grad);
  
  //console.log('n: ', array.length);
  //console.log('max: ', max);
  pmax = max.energy - min.energy;
  //console.log('pmax: ', pmax)
  //console.log('min: ', min);
  
  for(var i = 0; i < array.length; ++i){ 
    for(var j = 0; j < array[i].length; ++j){ 
      var ene = array[i][j];
      if(ene == min.energy) var color = {r: 0, g: 0, b: 0};
      //console.log(ene);
      else var color = gradColor(lim, ene, grad);
      ctx.fillStyle = 'rgba('+color.r+','+
                              color.g+','+
                              color.b+',1)';
      ctx.fillRect(i * size, j * size, size, size);
    }
  }
};

//var seq = "AB"
//var ang = [0, 0]

var medTime = 0;
  
var seqs = ["AABB", "ABBB", "BAAB", "BABB", "ABBA", "AAAA", "ABAA", "BBBB", "AAAB", "ABAB"];
var ang = [0, 0, 0, 0];
var container;

for(var s = 0; s < seqs.length; ++s){
  var startDate = new Date();  
  container = document.createElement('div');
  
  var protein = new Protein({'seq': seqs[s], 'ang': ang});
  //var seq = "ABBABBABABBAB"
  //var ang = [0, -1.49083, -1.50080, 0.87041, -1.48069, -1.51801, 1.46453, -1.95310, 1.44914, -1.51696, -1.48240, 1.04103, 0]
  //var ang = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    
  var data = Ela(protein, 20);
  data.min.render();
  print(data.results, 1, 4, data.min);
  
  document.body.appendChild(container);
  
  var t = (new Date).getTime() - startDate.getTime();
  medTime += t;
}
  

console.log(medTime/seqs.length + 'milisecs');