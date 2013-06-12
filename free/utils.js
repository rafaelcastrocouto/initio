this.canvas = document.createElement('canvas'); document.body.appendChild(canvas)
this.canvas.width = document.width
this.canvas.height = document.height
this.canvas.scale = 50
this.canvas.offset = 200
this.canvas.elements = []

this.canvas.addEventListener('mousemove', function(e){
  for(var i = 0; i < this.elements.length; ++i){
    this.elements[i].dispatchEvent('mousemove', e)
    if( ballCollision(
        this.elements[i].x * this.scale + this.offset, 
        this.elements[i].y * this.scale + this.offset, this.elements[i].radius, 
        e.x, e.y, 0)
      ){
      this.elements[i].dispatchEvent('hover', e)
    }
  }
})

this.canvas.addEventListener('mousedown', function(e){
  for(var i = 0; i < this.elements.length; ++i){
    if( ballCollision(
        this.elements[i].x * this.scale + this.offset, 
        this.elements[i].y * this.scale + this.offset, this.elements[i].radius, 
        e.x, e.y, 0)
      ){
      this.elements[i].dispatchEvent('mousedown', e)
    }
  }
})

this.canvas.addEventListener('mouseup', function(e){
  for(var i = 0; i < this.elements.length; ++i){
    if( ballCollision(
        this.elements[i].x * this.scale + this.offset, 
        this.elements[i].y * this.scale + this.offset, this.elements[i].radius, 
        e.x, e.y, 0)
      ){
      this.elements[i].dispatchEvent('mouseup', e)
    }
  }
})

this.canvas.addEventListener('click', function(e){
  for(var i = 0; i < this.elements.length; ++i){
    if( ballCollision(
        this.elements[i].x * this.scale + this.offset, 
        this.elements[i].y * this.scale + this.offset, this.elements[i].radius, 
        e.x, e.y, 0)
      ){
      this.elements[i].dispatchEvent('click', e)
    }
  }
})

this.context = canvas.getContext('2d')

this.Css = function(){
  this.element = document.createElement('style') 
  document.body.appendChild(this.element)
  this.rules = {}
  this.fonts = ['pixel', 'entypo']
}

this.Css.prototype.addRule = function(selector, obj){
  if(!this.rules[selector]) this.rules[selector] = {};
    for(var s in obj){
      this.rules[selector][s] = obj[s];
    };
    this.render();    
}  

this.Css.prototype.render = function(){
  var st = '\n';
  for(var selector in this.rules){
    st += selector + ' {\n';
    var props = this.rules[selector];
    for(var s in props){
      st += '  '+ s + ': ' + props[s] + ';\n';
    };
    st += '}\n'
  };
  this.element.textContent = st;
}

this.Css.prototype.toRGBA = function(color, alpha){
  var inv = 0;
  if(alpha == undefined) alpha = '1';
  else if(alpha == 'darker' || alpha == 'dark') {
    inv = -1;
    alpha = '1';
  } else if(alpha == 'ligher' || alpha == 'light') {
    inv = 1;
    alpha = '1';
  } else if(alpha >= 0 || alpha <= 1) {
    alpha = ''+alpha;
  }
  if(color[0] == '#') color = color.slice(1);
  var l = color.length;
  var ac = [
    color.slice(0,l/3), color.slice(l/3,2*l/3), color.slice(2*l/3,l)
  ]; 
  if(l == 3) for(var a in ac){ ac[a] += ac[a] };
  var c = {
    r: parseInt(ac[0], 16) + (6 * inv),
    g: parseInt(ac[1], 16) + (6 * inv),
    b: parseInt(ac[2], 16) + (6 * inv),
    a: alpha
  };
  if(c.r < 0) c.r = 0; if(c.r > 255) c.r = 255; 
  if(c.g < 0) c.g = 0; if(c.g > 255) c.g = 255; 
  if(c.b < 0) c.b = 0; if(c.b > 255) c.b = 255;

  return 'rgba( '+ c.r +', '+ c.g +', '+ c.b + ', '+ c.a +')';
}

this.rectCollision = function(x1, y1, w1, h1, x2, y2, w2, h2){
  return (x1 >= parseInt(x2) 
    && x1 <= parseInt(x2 + w1)   
    && (canvas.height - y1) >= parseInt(y2)
    && (canvas.height - y1) <= parseInt(y2 + h2))
}

this.ballCollision = function(x1, y1, r1, x2, y2, r2){
  var distance = 0;
  distance += Math.pow(Math.abs(x2 - x1), 2);
  distance += Math.pow(Math.abs(y2 - y1), 2);
  return distance <= Math.pow(r1 + r2, 2);
}

this.angToCoord = function(ang){
  var coord = [], x = 0, y = 0, g = 0, r = 1
  for(var i = 0; i < ang.length; ++i){
    x += r * Math.cos(g)
    y += r * Math.sin(g)
    coord[i] = {x: x, y: y}
    g -= ang[i]
  }
  return coord
}

this.checkCoord = function(coord){
  var x = coord.x * canvas.scale + canvas.offset,
      y = coord.y * canvas.scale + canvas.offset
  return {x: (x > 0 && x < document.width), y: (y > 0 && y < document.height)}
}

this.distance = function(i, j){
  return Math.pow( 
          Math.pow((i.x - j.x), 2) + 
          Math.pow((i.y - j.y), 2) , 0.5 )
}

this.coordToAng = function(coord){
  var ang = [], x, y, g, a = 0
  for(var i = 0; i < coord.length - 1; ++i){
  
    x = (coord[i + 1].x - coord[i].x)
    y = (coord[i + 1].y - coord[i].y)
    
    g = Math.atan2(y,x)

    ang[i] = a - g
    a = g

  }  //console.log('a: ', ang);
  ang[coord.length - 1] = 0
  return ang
}

this.checkAng = function(A){ 
  var c = 0
  for(var a = 0; a < A.length; ++a){ console.log('a: ', A[a].toFixed(2));
    if(A[a] > -Math.PI && A[a] < Math.PI) c = 1
  }
  return c
}