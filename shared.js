var Worker_send = function(message){ 
  if(this.webkitPostMessage){
    var string = JSON.stringify(message);
    var str2buff = function(str) {
      var buffer = new ArrayBuffer(str.length*2); // 2 bytes for each char
      var bufView = new Uint16Array(buffer);
      for (var i=0; i<str.length; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buffer;
    };
    var buffer = str2buff(string);
    this.webkitPostMessage(buffer, [buffer]);
  }else this.postMessage(message);
};

var Worker_receive = function(event){ 
  if(this.webkitPostMessage){
    var buff2str = function(buf) {
      var buffv = new Uint16Array(buf)
      var string = String.fromCharCode.apply(null, buffv);
      return string;
    };
    var string = buff2str(event.data);
    return JSON.parse(string);
  }else return event.data;
};


