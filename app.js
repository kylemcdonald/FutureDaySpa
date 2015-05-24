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
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
		var filename = dir + (new Date()) + '.jpg';
		console.log('saving screenshot to: ' + filename);
		fs.writeFile(filename, req.body, 'binary', function(err) {
			if(err) console.log(err);
			else console.log('saved screenshot');
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

app.get('/screenshot/recent', function(req, res) {
	var cameraId = req.query.cameraId;
	var dir = 'public/screenshots/' + cameraId + '/';
	var file = getClosestScreenshot(cameraId, new Date());
	var path = dir + '/' + file;
	res.sendfile(path);
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
	var recently = (new Date()) - (config.screenshotRewindMinutes * 60 * 1000);
	var screenshot = getClosestScreenshot(cameraId, recently);
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
			// timeout: 10000,
			// takeShotOnCallback: true, // might need to switch
			zoomFactor: zoomFactor,
			windowSize: {
				width: Math.round(baseSize[0] * zoomFactor),
				height: Math.round(baseSize[1] * zoomFactor)
			}
		};
		var url = 'http://localhost:8000/mockup.html?cameraId=' + cameraId + '&screenshot=' + screenshot;
		console.log('webshot');
		console.log('\tfrom: ' + url);
		console.log('\tto: ' + filename);
		console.log(options);
		webshot(url, filename, options, function (err) {
		    if (err) {
		    	console.error(err);
		    	// could try hitting /print again here
		    	return;
		    }
		    console.log('saved webshot');

    		// then place on page with image magick
    		// this whole section is blocking, which is bad practice
    		// but it's helpful for making lpr work correctly
    		// otherwise the image isn't ready in time
    		// we could also call a script
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

	    	// sh([
	    	// 	'mogrify',
	    	// 	'-background none',
	    	// 	'-extent ' + mediaSize[0] + 'x' + mediaSize[1],
	    	// 	'-page +' + imageOffset[0] + '+' + imageOffset[1],
	    	// 	'-flatten',
	    	// 	quote(filename)
    		// ]);

		    // // print with lpr
		    // sh([
		    // 	'lpr',
		    // 	// '-o landscape',
		    // 	'-o fit-to-page',
		    // 	'-o page-top=0',
		    // 	'-o page-right=0',
		    // 	'-o page-bottom=0',
		    // 	'-o page-left=0',
		    // 	'-o PageSize=Custom.' + 
		    // 		config.mediaDimensions[0] + 'x' +
		    // 		config.mediaDimensions[1] + 'in',
		    // 	quote(filename)
	    	// ]);
		})
	})
	res.sendStatus(200);
})
