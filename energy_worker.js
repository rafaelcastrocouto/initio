importScripts('energy.js');

var calc = function(event) {
  protein = JSON.parse(event.data).protein;
  this.postMessage(JSON.stringify({energy: energy(protein)}));
};

self.addEventListener('message', calc);