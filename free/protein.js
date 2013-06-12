this.Amino = function Amino(x, y, p, i){
  this.x = x || 0
  this.y = y || 0
  this.i = i
  this.ang = 0
  this.seq = p.seq[i]
  this.speed = { x: 0, y: 0 }
  this.radius = 10 //pixels
  this.events = {}
  this.protein = p
}

this.Amino.prototype.setCoord = function(obj){
  var x = checkCoord(obj).x,
      y = checkCoord(obj).y,
      check = 0
  if(x) {
    this.protein.coord[this.i].x = obj.x
    this.protein.ang = coordToAng(this.protein.coord)
    if(checkAng(this.protein.ang)){
      this.setAng(this.protein.ang)
      this.x = obj.x
    } else {
      check = 1
      this.protein.coord[this.i].x = this.x
    }
  }
  if(y) {
    this.protein.coord[this.i].y = obj.y
    this.protein.ang = coordToAng(this.protein.coord)
    if(checkAng(this.protein.ang)){
      this.setAng(this.protein.ang)
      this.y = obj.y
    } else {
      check = 1
      this.protein.coord[this.i].y = this.y
    }
  }
  if(check) this.protein.ang = coordToAng(this.protein.coord)
  //this.protein.energy = energy(this.protein)
}
this.Amino.prototype.setAng = function(a){
  for(var i = 0; i < this.protein.length; ++i){
    this.protein.aminos[i].ang = a[i]
  }
}

this.Amino.prototype.delete = function(){
  this.protein.aminos.splice(this.protein.aminos.indexOf(this), 1)
  canvas.elements.splice(canvas.elements.indexOf(this), 1)
  this.dispatchEvent('delete')
}

this.Amino.prototype.addEventListener = function(type, f){
  if(!this.events[type]) this.events[type] = []
  this.events[type].push({
    action: f,
    type: type,
    target: this
  })
}

this.Amino.prototype.dispatchEvent = function(type, evt){
  if(this.events[type]){
    for(var e = 0; e < this.events[type].length; ++e){
      if(evt) for(i in evt) this.events[type][e][i] = evt[i] 
      this.events[type][e].action.call(this, this.events[type][e])
    }
  }
}

this.Amino.prototype.removeEventListener = function(type, f){
  if(this.events[type]) {
    for(var e = 0; e < this.events[type].length; ++e){
      if(this.events[type][e].action == f) this.events[type].splice(e, 1)
    }
  }
}



this.Protein = function(seq, obj){

  this.length = seq.length
  this.seq = seq
  this.energy = Infinity
  this.aminos = []

  if(obj['angle']) {
    this.ang = obj['angle']
    this.coord = angToCoord(this.ang)
  }
  if(obj['coord']) {
    this.coord = obj['coord']
    this.ang = coordToAng(this.coord)
  }
  for(var i = 0; i < this.length; ++i){
    this.aminos[i] = new Amino(this.coord[i].x, this.coord[i].y, this, i)
    this.aminos[i].seq = this.seq[i]
    this.aminos[i].ang = this.ang[i]
    this.aminos[i].protein = this
    if(seq[i] == 'A') this.aminos[i].fill = '#ddd'
    else this.aminos[i].fill = '#444'
  }
  //this.energy = energy(this)
}
var min = Infinity
this.Protein.prototype.render = function(){
  var ox, oy
  context.fillStyle = 'rgba(255,255,255,0.8)'
  context.fillRect(0,0,canvas.width, canvas.height)
  
  for(var i = 0; i < this.length; ++i){
    //CONNECTION STROKE
    if(i != 0){
      context.beginPath()
      context.moveTo(ox * canvas.scale + canvas.offset, 
                     oy * canvas.scale + canvas.offset)
      context.lineTo(this.aminos[i].x * canvas.scale + canvas.offset, 
                     this.aminos[i].y * canvas.scale + canvas.offset)
      context.closePath()
      context.strokeStyle = this.aminos[i].stroke || 'black'
      context.stroke()
    }
    ox = this.aminos[i].x
    oy = this.aminos[i].y
  }
  
  for(var i = 0; i < this.length; ++i){
    //AMINO CIRCLE
    context.beginPath()
    context.arc(
      this.aminos[i].x * canvas.scale + canvas.offset, 
      this.aminos[i].y * canvas.scale + canvas.offset, 
      this.aminos[i].radius,
      0, Math.PI*2, 0) //start , end angle, cc
    context.closePath()
    context.strokeStyle = this.aminos[i].stroke || 'black'
    context.stroke()
    context.fillStyle = this.aminos[i].fill || 'black'
    context.fill()
  }

  context.fillStyle = 'black'
  if(protein.energy < min) min = protein.energy
  context.fillText(protein.energy.toFixed(10), 10, 10);
  context.fillText(min.toFixed(10), 10, 20);
}

this.Protein.prototype.copy = function(){
  var seq = ''
  var coord = []
  for(var i = 0; i < this.aminos.length; ++i){ 
    seq += this.aminos[i].seq
    coord[i] = {
      x: this.aminos[i].x,
      y: this.aminos[i].y
    }
  }
  var newProtein = new Protein(seq, {'coord': coord})
  return newProtein
}


this.Protein.prototype.cool = function(){
  var speed = 0.001

  energyXY(protein)

  for(var i = 0; i < protein.length; ++i){

    var amino = protein.aminos[i]
    if(amino.movable) continue
    var x = amino.x - amino.energy.x * speed
    var y = amino.y - amino.energy.y * speed
    
    amino.setCoord({x: x, y: y})

  }

  protein.render()
}
