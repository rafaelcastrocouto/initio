/*
var protein = new protein({
  seq: "ABBABBABABBAB",
  ang: [0, -1.49083, -1.50080, 0.87041, -1.48069, -1.51801, 1.46453, -1.95310, 1.44914, -1.51696, -1.48240, 1.04103, 0]
});
console.log('energy: ', energy(protein)); //-3,29...;
*/

/**
 * Calculates the coefficient "C" from a AB model pair (AB model energy calculation)
 * @param {String} i - Type of the first aminoacid model ("A" or "B").
 * @param {String} j - Type of the second aminoacid model ("A" or "B").
 */
var C = function(i, j){ 
  if(i.seq == 'A' && j.seq == 'A') return 1;
  if(i.seq == 'A' && j.seq == 'B'
  || i.seq == 'B' && j.seq == 'A') return -0.5;
  if(i.seq == 'B' && j.seq == 'B') return 0.5;
}
/**
 * Calculates euclidean distance between two points 
 * @param {i} Point - An object with x and y values ({x: Float, y: Float})
 * @param {j} Point - Another object with x and y values 
 */
var distance = function(i, j){
  return Math.pow( 
          Math.pow((i.x - j.x), 2) + 
          Math.pow((i.y - j.y), 2), 
        0.5 );
}
/**
 * Calculates the energy of a AB model protein
 * @param {protein} Protein - A protein in AB model with a series of aminoacids 
 */
var energy = function(protein){
  var aminos = protein.aminos;
  var n = aminos.length;

  var v1 = 0;
  for (var i = 1; i < (n - 1); ++i) {
    v1 += (1 - Math.cos(aminos[i].ang));
  };

  var v2 = 0;
  for (var i = 0; i < (n - 2); ++i) {
    for (var j = (i + 2); j < n; ++j) {
      var d = distance(aminos[i], aminos[j]);
      v2 += ( Math.pow(d, -12) - C(aminos[i], aminos[j]) * Math.pow(d, -6));
    }
  }

  return ((1/4) * v1) + (4 * v2);
}