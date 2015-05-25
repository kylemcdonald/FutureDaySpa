// might need to use this to trigger phantomjs
function doneRendering() {
  window.callPhantom && window.callPhantom('takeShot');
}

// var spinner = '|/-\\'; var i = 0; setInterval(function() {
//   document.body.innerText = spinner[i % spinner.length];
//   i++;
// }, 100);

function cycleCrosshairsLabel() {
  var label = d3.select('#crosshairs-label');
  label.transition()
    .duration(250)
    .style('opacity', 0)
    .style('padding-left', '20px')
    .transition()
    .text(generateLiteral())
    .style('padding-left', '0')
    .duration(250)
    .style('opacity', 1);

  var number = d3.select('#crosshairs-number');
  var duration = _.random(
    config.crosshairs.cycle.min,
    config.crosshairs.cycle.max);
  number.transition()
    .duration(duration)
    .tween('text', function() {
    var start = parseInt(this.textContent);
    var end = _.random(0, 99);
    var i = d3.interpolateRound(start, end);
    return function(t) {
      this.textContent = formatPercentage(i(t));
    };
  });

  var percentage = d3.select('#crosshairs-percentage');
  percentage.transition()
    .duration(250)
    .style('opacity', 0)
    .style('padding-top', '20px')
    .transition()
    .style('padding-top', '0px')
    .duration(250)
    .style('opacity', 1);

  var crosshairs = d3.select('#crosshairs');
  crosshairs.transition()
    .duration(duration / 2)
    .style('left', _.random(
      config.crosshairs.range.left.min,
      config.crosshairs.range.left.max))
    .style('top', _.random(
      config.crosshairs.range.top.min,
      config.crosshairs.range.top.max))
  setTimeout(cycleCrosshairsLabel, duration);
}

function cycleDebugTitle() {
  var title = $('#debug-title');
  title.text(generatePhrase());
  var duration = _.random(
    config.debugTitle.cycle.min,
    config.debugTitle.cycle.max);
  setTimeout(cycleDebugTitle, duration);  
}

function cycleDebugText() {
  var body = $('#debug-body');
  var text = body.text() + _.sample(strings.joinery) + generatePhrase();
  var chop = text.length - config.debugBody.maxLength;
  if(chop > 0) {
    text = text.substr(chop);
  }
  body.text(text);
  var duration = _.random(
    config.debugBody.cycle.min,
    config.debugBody.cycle.max);
  setTimeout(cycleDebugText, duration);  
}

function cycleMono() {
  d3.select('#mono-final')
    .style('opacity', 0)
    .transition()
    .duration(400)
    .style('opacity', 1)
    .ease('linear');
  setTimeout(cycleMono, 1000);
}

function startObsessing (event) {
  console.log('startObsessing');
  if(event) {
    console.log('due to:');
    console.log(event);
  }
  hangUp();
  leaveVoicemail();
}

function hangUp() {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
    window.existingCall = null;
    console.log('hung up on existing call');
  }
}

function leaveVoicemail() {
  if(window.existingCall) {
    return;
  }
  if(peer.disconnected) {
    console.log('got disconnected, reconnecting');
    peer.reconnect();
  }
  if(peer.id) {
    var query = {
      clientId: peer.id,
      cameraId: config.cameraId
    };
    $.get('voicemail', query, function( data ) {
      console.log('left a voicemail message from ' + query.clientId + ' / ' + query.cameraId);
    });
  }
  setTimeout(leaveVoicemail, config.voicemailTimeout);
}

// PeerJS object
var peer = new Peer({ key: config.peerjsApiKey });

// Receiving a call
peer.on('call', function(call){
  hangUp();
  call.answer();
  window.existingCall = call;
  console.log('answered incoming call:');
  console.log(call);

  // Wait for stream, then set peer video display
  call.on('stream', function(stream){
    console.log('setting stream:');
    console.log(stream);
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  call.on('close', startObsessing);
  call.on('error', startObsessing);
});
peer.on('disconnected', function(err){
  console.log('disconnected from peer:');
  console.log(err);
  // this is handled by 'error' (i think)
  // startObsessing(err);
});
peer.on('error', function(err){
  startObsessing(err);
});

function postJSON(url, data) {
  $.ajax({
    contentType: 'application/json',
    url: url,
    type: 'POST',
    data: JSON.stringify(data)
  });
}

var sessions = [];
var sessionData = {};
function uploadSessionData() {
  console.log('uploading session data:');
  console.log(sessionData);
  postJSON(
    config.remote + '/add/session',
    sessionData);
}

// ratio between begin and end hr
// if begin hr = 80, end hr = 50
// gain is 1.6x
function calculateGain(data) {
  return (data.begin.hr / data.end.hr);
}

function calculateGains(sessions) {
  return sessions.map(function(session) {
    return calculateGain(session);
  })
}

function calculatePercentile(sample, data) {
  var without = _.without(data, sample);
  if(without.length == 0) {
    return 50;
  }
  var sorted = without.sort();
  var sortedIndex = _.sortedIndex(sorted, sample);
  var percentile = sortedIndex / sorted.length;
  return parseInt(percentile * 100);
}

function formatPercentage(x) {
  return (x < 10 ? '0' : '') + x;
}

function updateHrVisuals() {
  // show range (first in debug, then in range at bottom left)
  var spo2 = sessionData.end.spo2;
  dialSpo2.setPercent(Math.pow(spo2 / 100, 5));
  var hr = sessionData.end.hr;
  var overall = calculatePercentile(
    calculateGain(sessionData),
    calculateGains(sessions)
  );
  overall += _.random(-3, +3); // add some jitter to ranking
  overall = Math.max(overall, 1);
  overall = Math.min(overall, 99);
  dialOverall.setPercent(overall / 100);
  $('#overall-number').text(formatPercentage(overall));
  $('#spo2-number').text(spo2);
  $('#latest-data').text(hr + ' bpm / ' + spo2 + '%');
  $('#latest-data-time')
    .attr('title', sessionData.end.time + 'Z')
    .timeago();
  $('#record-count').text(sessions.length + ' sessions');  
  doneRendering();
}

function updateHrData() {
  console.log('updating records from database...');
  var url = config.remote + '/get/data';
  $('#records-link').attr('href', url);
  $.getJSON(url, {
      serial: config.curSerial,
      limit: 2
    }, function (data) {
      sessionData = {
        begin: data[0],
        end: data[1]
      }
      console.log('updated sessionData:');
      console.log(sessionData);
      var url = config.remote + '/get/sessions';
      $.getJSON(url, function(data) {
        sessions = data;
        console.log('updated sessions:');
        console.log(sessions);
        if(sessions.length) {
          updateHrVisuals();
        }
      });
  })
}

var dataSocket = io.connect(config.remote);
dataSocket.on('status', function (data) {
  console.log('got status from dataSocket:');
  console.log(data);
  dataSocket.emit('status', { client: location.href });
});
dataSocket.on('update', function (data) {
  if(data.serial == config.curSerial) {
    console.log('heart rate update:');
    console.log(data);
    updateHrData();
  }
});

$(function() {
  if(!Arg('debug')) {
		var screenshot = Arg('screenshot');
		if(screenshot) {
			$('#background').prop('src', 'screenshots/'+config.cameraId+'/'+screenshot);
		} else {
			startObsessing();
		}
	}

	cycleCrosshairsLabel();
	cycleDebugTitle();
	cycleDebugText();
	cycleMono();

  updateHrData();

	$('#debug-info').click(function() {
    uploadSessionData();
		$.get('/print', { cameraId: config.cameraId });
		d3.select('#debug-info')
		  .style('opacity', 1)
		  .transition()
		  .duration(500)
		  .style('opacity', 0)
		  .transition()
		  .style('visibility', 'hidden')
		  .transition()
		  .delay(10000)
		  .duration(2000)
		  .style('visibility', 'visible')
		  .style('opacity', 1);
	})
})

$(document).on('mousemove touchmove', function(event) {
	d3.select('#debug')
		.transition()
		.style('opacity', 1)
		.transition()
		.delay(3000)
		.style('opacity', 0)
		.ease('linear');
})