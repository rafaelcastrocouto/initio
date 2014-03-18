/**
 * Represents an aminoacid model.
 * @constructor
 * @param {float} x - The aminoacid's x position.
 * @param {float} y - The aminoacid's y position.
 * @param {Protein} p - The protein that contains the aminoacid chain.
 * @param {Protein} i - The position of the aminoacid in the primary chain.
 */
var Amino = function Amino(x, y, p, i){;
  this.x = x;
  this.y = y;
  //this.protein = p;
  this.i = i;
  this.radius = 5; //pixels
}
/**
 * Represents a protein model.
 * @constructor
 * @param {Object} obj - Protein options {[seq, ang || coord]}.
 * @param {String} obj.seq - String with the aminoacid's type sequence.
 * @param {Array} obj.ang - The angle sequence in radians.
 * @param {Array} obj.coord - The aminocids coordinates (x, y).
 */
var Protein = function(obj){
  this.aminos = [];
  
  if(!obj.seq) obj.seq = fibonacci(this.length);  
  this.seq = obj.seq;
  
  if(obj.ang) {
    obj.coord = angToCoord(obj.ang);
    this.length = obj.ang.length;
    
  } else if(obj.coord) {
    obj.ang = coordToAng(obj.coord);
    this.length = obj.coord.length;
  }

  for(var i = 0; i < this.length; ++i){
    this.aminos[i] = new Amino(obj.coord[i].x, obj.coord[i].y, this, i);
    this.aminos[i].ang = obj.ang[i];
    this.aminos[i].seq = obj.seq[i];
    if(obj.seq[i] == 'A') this.aminos[i].fill = '#ddd';
    else this.aminos[i].fill = '#444';
  }
  this.energy = energy(this);
}
/**
 * Return an array with the angle sequence.
 * @param {int} n - The float precision (Number of digits after the decimal point).
 */
Protein.prototype.getAngle = function(n){
  var a = [];
  for(var i = 0; i < this.length; ++i){
    if(!n) a[i] = parseFloat(this.aminos[i].ang);
    else a[i] = parseFloat(this.aminos[i].ang).toFixed(n);
  }
  return a;
}
/**
 * Return an string with the aminoacid's type sequence.
 */
Protein.prototype.getSeq = function(){
  var a = [];
  for(var i = 0; i < this.length; ++i){
    a[i] = this.aminos[i].seq;
  }
  return a;
}
/**
 * Return an array with the aminocids coordinates (x, y).
 */
Protein.prototype.getCoord = function(){
  var a = [];
  for(var i = 0; i < this.length; ++i){
    a[i] = [this.aminos[i].x, this.aminos[i].y];
  }
  return a;
}
/**
 * Render the protein in a canvas.
 * @param {Context} ctx - The canvas context in witch the protein will be rendered.
 */
Protein.prototype.render = function(ctx){
  var context = ctx || this.context;
  if(!context) {
    var canvas = createCanvas(1000, 500);
        canvas.scale = 20;
        canvas.offset = 200;
    context = canvas.getContext('2d');    
    this.context = context;
  }
  var ox, oy, canvas = context.canvas;
  context.fillStyle = 'rgba(255,255,255,0.75)';
  context.fillRect(0,0,canvas.width, canvas.height);
  
  for(var i = 0; i < this.length; ++i){
    //CONNECTION STROKE
    if(i != 0){
      context.beginPath();
      context.moveTo(ox * canvas.scale + canvas.offset, 
                     oy * canvas.scale + canvas.offset)
      context.lineTo(this.aminos[i].x * canvas.scale + canvas.offset, 
                     this.aminos[i].y * canvas.scale + canvas.offset);
      context.closePath();
      context.strokeStyle = this.aminos[i].stroke || 'black';
      context.stroke();
    }
    ox = this.aminos[i].x;
    oy = this.aminos[i].y;
  }
  
  for(var i = 0; i < this.length; ++i){
    //AMINO CIRCLE
    context.beginPath();
    context.arc(
      this.aminos[i].x * canvas.scale + canvas.offset, 
      this.aminos[i].y * canvas.scale + canvas.offset, 
      this.aminos[i].radius,
      0, Math.PI*2, 0); //start angle, end angle, cc
    context.closePath();
    context.strokeStyle = this.aminos[i].stroke || 'black';
    context.stroke();
    context.fillStyle = this.aminos[i].fill || 'black';
    context.fill();
  }
  context.fillStyle = 'black';
  context.fillText(this.energy, 10, 20);
}
