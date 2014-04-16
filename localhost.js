var port = 3000,                            // http port
    dir = __dirname,                        // current directory
    fs = require('fs'),                     // file system i/o
    http = require('http'),                 // http server
    connect = require('connect');           // middleware framework module

var app = connect()
.use(connect.favicon())                     // default fav icon
.use(connect.logger('dev'))                 // auto console log
.use(connect.static(dir))                   // serve static files
.use(connect.directory(dir, {icons: true})) // serve directories
.use(connect.bodyParser())                  // parses post content
.use(function(req, res){                    // custom URLs
  console.log('URL', req.url);
  if(req.url == '/post'){                   // write post to file    
    var data = '\n' + req.body.data;
    fs.appendFile(dir+'/csv/results.csv', data, function(err){
      if(err) throw err;
      console.log('FS appendFile success!');
      res.end(JSON.stringify({status: 'success'}));
    });
  }
});

var httpServer = http.createServer(app).listen(port);

console.log(new Date() + '\n' 
            + '\x1B[1m'   //style:bright
            + '\x1B[33m'  //color:yellow
            + 'FS directory at: ' + dir + '\n'
            + 'HTTP server at: http://localhost:'+port+'/'
            + '\x1B[0m'); //style:reset 
