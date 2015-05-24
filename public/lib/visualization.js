// might need to use this to trigger phantomjs
function doneRendering() {
  setTimeout(function() {
    window.callPhantom && window.callPhantom('takeShot');
  }, 500);
}

function cycleCrosshairsLabel() {
  var label = d3.select('#crosshairs-label');
  label.transition()
    .duration(250)
    .style('opacity', 0)
    .style('padding-left', '10px')
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
      var text = i(t)
      if(text < 10) { text = '0' + text; }
      this.textContent = text;
    };
  });

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

$(function() {
  var screenshot = Arg('screenshot');
  if(screenshot) {
    $('#background').prop('src', 'screenshots/'+config.cameraId+'/'+screenshot);
  }

  cycleCrosshairsLabel();
  cycleDebugTitle();
  cycleDebugText();
  cycleMono();

  $('#debug-info').click(function() {
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