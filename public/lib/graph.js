var AlternateGenerator = {
  cur: false,
  next: function () {
    this.cur = this.cur ? false : true;
    return this.cur;
  }
}

function randomArray(min, max, n) {
  var x = new Array(n);
  for(var i = 0; i < n; i++) {
    x[i] = _.random(min, max);
  }
  return x;
}

var graphWidth = 880, graphHeight = 140;

var y = d3.scale.linear()
    .range([graphHeight, 0])
    .domain([0, config.graphBars.dataRange.max]);

var graph = d3.select('#graph')
    .attr('width', graphWidth)
    .attr('height', graphHeight);

var barWidth = graphWidth / config.graphBars.count;

function createBars() {
  var data = randomArray(
    config.graphBars.dataRange.min,
    config.graphBars.dataRange.max,
    config.graphBars.count);
  return graph.selectAll('g')
    .data(data)
  .enter()
    .append('rect')
    .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ',0)'; })
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('opacity', .2)
    .attr('y', function(d) { return y(d); })
    .attr('height', function(d) { return graphHeight - y(d); })
    .attr('width', barWidth - 1)
    .attr('fill', function(d, i) {
      var a = (i / config.graphBars.colorWidth) % config.graphBars.colors.length;
      var b = (a + 1) % config.graphBars.colors.length;
      var c = a % 1;
      a = Math.floor(a);
      b = Math.floor(b);
      return d3.interpolateRgb(config.graphBars.colors[a], config.graphBars.colors[b])(c);
      // return colors[a];
    });
}

function shiftData(bars) {
  var data = randomArray(
    config.graphBars.dataRange.min,
    config.graphBars.dataRange.max,
    config.graphBars.count);
  var minDuration = config.graphBars.duration.min;
  var maxDuration = config.graphBars.duration.max;
  bars
    .data(data)
    .transition()
    .delay(function(d, i) {
      return ((config.graphBars.count - i - 1) * config.graphBars.delay) / config.graphBars.count;
    })
    .duration(function(d) {
      return _.random(minDuration, maxDuration);
    })
    .attr('y', function(d) { return y(d); })
    .attr('height', function(d) { return graphHeight - y(d); })
  setTimeout(function() { shiftData(bars) }, maxDuration);
}

shiftData(createBars());
shiftData(createBars());