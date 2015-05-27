var config = require('./config.json');
var sys = require('sys');
var child = require('child_process');
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
});

app.get('/voicemail', function(req, res) {
	io.sockets.emit('voicemail', req.query);
	res.sendStatus(200);
})

var manualPhotos = {};
app.post('/screenshot/upload', function(req, res) {
	console.log('/screenshot/upload');
	console.log(req.query);
	var cameraId = req.query.cameraId;
	var dir = 'public/screenshots/' + cameraId + '/';
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
	    var timestamp = Math.floor((new Date() / 1000));
		var filename = (req.query.manual ? 'manual-' : 'auto-') + timestamp + '.jpg';
		var path = dir + filename;
		console.log('saving screenshot to: ' + path);
		fs.writeFile(path, req.body, 'binary', function(err) {
			if(err) console.log(err);
			else console.log('saved screenshot');
			if(req.query.manual) {
				console.log('manually triggered');
				manualPhotos[cameraId] = filename;
			}
		});
	});
	res.sendStatus(200);
})

function getClosestScreenshot(cameraId, date) {
	var dir = 'public/screenshots/' + cameraId + '/';
	var files = fs.readdirSync(dir);
	if(!files) return null;
	files = files.filter(function(file) {
		return file.match(/\.jpg$/i);
	})
	if(!files) return null;
	var bestDiff = 0;
	var bestFile = null;
	files.forEach(function(file) {
		var path = dir + '/' + file;
		var stats = fs.statSync(path);
		var curDate = new Date(stats.mtime);
		var curDiff = Math.abs(date - curDate);
		if(curDiff < bestDiff || bestFile == null) {
			bestDiff = curDiff;
			bestFile = file;
		}
	})
	return bestFile;
}

function getScreenshot(cameraId) {
	if(manualPhotos[cameraId]) {
		var screenshot = manualPhotos[cameraId];
		manualPhotos[cameraId] = null;
		console.log('using manual screenshot');
		return screenshot;
	} else {
		console.log('using automatic screenshot');
		var recently = (new Date()) - (config.screenshotRewindMinutes * 60 * 1000);
		return getClosestScreenshot(cameraId, recently);		
	}
}

app.get('/screenshot/clear', function(req, res) {
	var cameraId = req.query.cameraId;
	if(manualPhotos[cameraId]) {
		console.log('clearing screenshot for ' + cameraId);
		manualPhotos[cameraId] = null;
	}
	res.sendStatus(200);
})

app.get('/screenshot/request', function(req, res) {
	console.log('sending screenshot request');
	io.sockets.emit('screenshot', req.query);	
	res.sendStatus(200);
})

app.get('/screenshot/recent', function(req, res) {
	var cameraId = req.query.cameraId;
	var dir = 'public/screenshots/' + cameraId + '/';
	var file = getClosestScreenshot(cameraId, new Date());
	var path = dir + '/' + file;
	res.sendfile(path);
})

app.get('/screenshot/list', function(req, res) {
	var cameraId = req.query.cameraId;
	var dir = 'public/screenshots/' + cameraId;
	var json = [];
	var files = fs.readdirSync(dir)
	.filter(function(file) {
		return file.match(/\.jpg$/i);
	})
	.map(function(file) {
		var path = dir + '/' + file;
		var stats = fs.statSync(path);
		var time = new Date(stats.mtime);
		return {
			file: file,
			time: time
		}
	})
	.sort(function(a, b) {
		return b.time - a.time;
	})
	res.json(files);
})

function sh(cmd) {
	var cmdStr = cmd.join(' ');
	console.log(cmdStr);
	child.exec(cmdStr);
}

function quote(str) {
	return '"' + str + '"';
}

app.get('/print', function(req, res) {
	console.log('/print');
	console.log(req.query);
	var cameraId = req.query.cameraId;
	var screenshot = getScreenshot(cameraId);
	var dir = 'public/prints/' + cameraId + '/';
	var filename = dir + (new Date()) + '.png';
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
    	// get the right imageSize and zoomFactor
	    var baseSize = [1280., 720.];
	    var imageSize = [
	    	config.imageDimensions[0] * config.printPpi,
	    	config.imageDimensions[1] * config.printPpi
	    ];
		var zoomFactor = imageSize[0] / baseSize[0];
		var options = 
		{
			// phantomPath: '/usr/local/bin/phantomjs',
			timeout: 60 * 1000,
			takeShotOnCallback: true, // might need to switch
			zoomFactor: zoomFactor,
			windowSize: {
				width: Math.round(baseSize[0] * zoomFactor),
				height: Math.round(baseSize[1] * zoomFactor)
			}
		};
		var url = 'http://localhost:8000/client.html?' +
			'&render=true' +
			'&screenshot=' + cameraId + '/' + screenshot +
			'&overall=' + req.query.overall +
			'&spo2=' + req.query.spo2 +
			'&begin=' + req.query.begin +
			'&end=' + req.query.end;
		console.log('webshot');
		console.log('\tfrom: ' + url);
		console.log('\tto: ' + filename);
		console.log(options);
		webshot(url, filename, options, function (err) {
		    if (err) {
		    	console.error(err);
		    	return;
		    }
		    console.log('saved webshot');

		    var mediaSize = [
		    	Math.round(config.mediaDimensions[0] * config.printPpi),
		    	Math.round(config.mediaDimensions[1] * config.printPpi)
		    ];
		    var imageOffset = [
		    	Math.round(config.imageOffset[0] * config.printPpi),
		    	Math.round(config.imageOffset[1] * config.printPpi)
	    	];

	    	sh([
	    		'./print.sh',
	    		mediaSize[0],
	    		mediaSize[1],
	    		imageOffset[0],
	    		imageOffset[1],
	    		config.mediaDimensions[0],
	    		config.mediaDimensions[1],
	    		quote(filename)
    		]);
		})
	})
	res.sendStatus(200);
})
