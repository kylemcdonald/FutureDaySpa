var mkdirp = require('mkdirp');
var webshot = require('webshot');
var bodyParser = require('body-parser')
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb'}));
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.emit('status', { server: __filename });
	socket.on('status', function (data) {
		console.log(data);
	});

	app.get('/voicemail', function(req, res) {
		io.sockets.emit('voicemail', req.query);
		res.sendStatus(200);
	})
});

app.post('/screenshot/upload', function(req, res) {
	console.log('/screentshot/upload');
	console.log(req.query);
	var cameraId = req.query.cameraId;
	var dir = 'public/screenshots/' + cameraId + '/';
	console.log('mkdirp ' + dir);
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
		var filename = dir + (new Date()) + '.jpg';
		console.log('saving screenshot to: ' + filename);
		fs.writeFile(filename, req.body, 'binary', function(err) {
			if(err) console.log(err);
		});
	});
	res.sendStatus(200);
})

function getClosestScreenshot(cameraId, date) {
	var dir = 'public/screenshots/' + cameraId + '/';
	var files = fs.readdirSync(dir);
	if(!files) return null;
	files = files.filter(function(file) {
		if(file.match(/\.jpg$/i)) return file;
	})
	if(!files) return null;
	var bestDiff = 0;
	var bestPath = null;
	files.forEach(function(file) {
		var path = dir + '/' + file;
		var stats = fs.statSync(path);
		var curDate = new Date(stats.mtime);
		var curDiff = date - curDate;
		if(curDiff < bestDiff || bestPath == null) {
			bestDiff = curDiff;
			bestPath = path;
		}
	})
	return bestPath;
}

app.get('/screenshot/recent', function(req, res) {
	var cameraId = req.query.cameraId;
	res.sendfile(getClosestScreenshot(cameraId, new Date()));
})

app.get('/print', function(req, res) {
	console.log('/print');
	console.log(req.query);
	var cameraId = req.query.cameraId;
	var screenshot = req.query.screenshot; // should pull this from the second-most recent screenshot
	var dir = 'public/prints/' + cameraId + '/';
	var filename = dir + (new Date()) + '.png';
	console.log('mkdirp ' + dir);
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
		var zoomFactor = 2;
		var options = 
		{
			// timeout: 10000,
			// takeShotOnCallback: true, // might need to switch
			zoomFactor: zoomFactor,
			windowSize: { 
				width: 1280 * zoomFactor,
				height: 720 * zoomFactor
			}
		};
		var url = 'http://localhost:8000/mockup.html?cameraId=' + cameraId + '&screenshot=' + screenshot;
		console.log('webshot\n\tfrom: ' + url + '\n\tto: ' + filename);
		webshot(url, filename, options, function (err) {
		    if (err) {
		    	console.error(err);
		    	// could try hitting /print again here
		    	return;
		    }
		    console.log('saved');
		    // now position `filename` on the page and print
		    // with the `printer` module
		})
	})
	res.sendStatus(200);
})
