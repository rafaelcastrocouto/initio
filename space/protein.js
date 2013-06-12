var Amino = function Amino(x, y, p, i){;
  this.x = x;
  this.y = y;
  this.i = i;
  this.ang = 0;
  this.seq = p.seq[i];
  this.radius = 10; //pixels
  this.protein = p;
}

var Protein = function(obj){
  this.aminos = [];

  if(obj['ang']) {
    this.ang = obj['ang'];
    this.coord = angToCoord(this.ang);
    this.length = obj['ang'].length;
  } else if(obj['coord']) {
    this.coord = obj['coord'];
    this.ang = coordToAng(this.coord);
    this.length = obj['coord'].length;
  }

  if(obj.seq) this.seq = obj.seq;
  else  this.seq = getFibonacci(this.length);

  for(var i = 0; i < this.length; ++i){
    this.aminos[i] = new Amino(this.coord[i].x, this.coord[i].y, this, i);
    this.aminos[i].seq = this.seq[i];
    this.aminos[i].ang = this.ang[i];
    this.aminos[i].protein = this;
    if(seq[i] == 'A') this.aminos[i].fill = '#ddd';
    else this.aminos[i].fill = '#444';
  }
  this.energy = energy(this);
  this.minEnergy = Infinity;
}

Protein.prototype.render = function(){
  if(!this.ctx) {
    var canvas = createCanvas(800, 200);
    canvas.scale = 50;
    canvas.offset = 50;
    this.ctx = canvas.getContext('2d');                         
  }
  var ox, oy;
  var context = this.ctx;
  context.fillStyle = 'rgba(255,255,255,0.6)';
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
  context.fillText(protein.energy.toFixed(10), 10, 10);
}
