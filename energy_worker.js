importScripts('energy.js');
importScripts('shared.js');

var calc = function(event) {
  protein = self.receive(event);
  var ener = energy(protein.arr, protein.seq);
  self.send(ener);
};

self.send = Worker_send;
self.receive = Worker_receive;
self.onmessage = calc;