var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});

	app.get('/voicemail', function(res, req) {
		io.sockets.emit('voicemail', res.query);
		req.sendStatus(200);
	})
});