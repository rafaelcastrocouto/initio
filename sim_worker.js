importScripts('energy.js');
importScripts('shared.js');

var calc = function(event) {
  protein = self.receive(event);
  
  var arr1 = [];
  var arr2 = [];
  for(var i in protein.arr) {
    arr1[i] = protein.arr[i];
    arr2[i] = protein.arr[i];
  }
  var j  = parseInt(protein.n);
  arr1[j] = parseFloat(arr1[j]) - parseFloat(protein.r);
  arr2[j] = parseFloat(arr2[j]) + parseFloat(protein.r);

  var res = [];
  res.push(protein);
  res.push({arr: arr1, energy: energy(arr1, protein.seq), n: j});
  res.push({arr: arr2, energy: energy(arr2, protein.seq), n: j});
  res.sort(function(a,b){return a.energy - b.energy});
  self.send(res.shift());


};

self.send = Worker_send;
self.receive = Worker_receive;
self.onmessage = calc;