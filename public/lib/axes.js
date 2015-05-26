var axesWidth = 880, axesHeight = 30;

var xScale = d3.scale.linear().range([0, axesWidth]),
    xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(-axesHeight)
      .ticks(10)
      .tickSubdivide(true);

var svg = d3.select('#axes')
    .attr('width', axesWidth)
    .attr('height', axesHeight);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + axesHeight + ')')

var axesInitialized = false;
function zoomToRange(left, right, padding, duration) {
  if(!axesInitialized) {
    duration = 0;
    axesInitialized = true;
  }
  var range = right - left;
  left -= range * padding;
  right += range * padding;
  xScale.domain([ left, right ])
    svg.transition()
      .duration(duration)
      .select('.x.axis')
      .call(xAxis)
      .selectAll('text')
        .attr('transform', 'translate(5,-28)')
}