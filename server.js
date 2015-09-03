var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    console.log('Connection');
    var path = url.parse(request.url).pathname;
    console.log(__dirname + path);

    switch(path){
        case '/plain.html':
	    response.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
	    response.write('<html><body><h1>Hello world</h1></body></html>' );
	    response.end();
	    break;
        case '/test.html':
	    fs.readFile(__dirname + path, 'utf8', function(error, data){
	        console.log('Error value: ' + error);
                console.log('data value: ' + data);
		if (error){
		    response.writeHead(404);
		    response.write("opps this doesn't exist - 404");
		} else {
		    response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
		    response.write(data);
		    
		}
                response.end();
	    });
	    break;
	case '/':
	    fs.readFile(__dirname + '/socket.html', 'utf8', function(error, data){
	        console.log('Error value: ' + error);
                console.log('data value: ' + data);
		if (error){
		    response.writeHead(404);
		    response.write("opps this doesn't exist - 404");
		} else {
		    response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
		    response.write(data);
		    
		}
                response.end();
	    });
	    break;
        case 'button.css':
          fs.readFile(__dirname + path, 'utf8', function (err, data) {
            console.log('css');
            if (error){
		    response.writeHead(404);
		    response.write("opps this doesn't exist - 404");
            } else {
              response.writeHead(200, { 'Content-Type': 'text/css' });
              response.write(data, 'utf-8');
            }
            response.end();
          });
          break;
	default:
	    response.writeHead(404);
	    response.write("Oops! this doesn't exist - 404");
            response.end();
	    break;
    }
});

var port = process.env.PORT || 5000
server.listen(port);

var io = require('socket.io').listen(server);

console.log("http server listening on %d", port)

io.set('log level', 1);

io.sockets.on('connection', function(socket){
    // send data to client
    setInterval(function(){
      socket.emit('date', {'date': new Date()});
      // socket.emit('lightR', 'Stuff');
    }, 1000);

    // recieve client data
    socket.on('client_data', function(data){
      console.log('Server: ' + data.letter);
      socket.emit('letterR', data.letter);
      console.log('Letter sent');
    });
    socket.on('light', function(data){
      console.log('Server: ' + data);
      socket.broadcast.emit('lightR', data);
      console.log('light sent');
    });
});

function favicon(response) {
    console.log("Request handler 'favicon' was called.");
    var img = fs.readFileSync('./favicon.ico');
    response.writeHead(200, {"Content-Type": "image/x-icon"});
    response.end(img,'binary');
}
// exports.favicon = favicon;

var handle = {}
handle["/favicon.ico"] = favicon;
