var axesWidth = 880, axesHeight = 30;

var x = d3.scale.linear().range([0, axesWidth]),
    xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(-axesHeight)
      .ticks(10)
      .tickSubdivide(true);

var min = 60;
var max = 80;
x.domain([min, max]);

var svg = d3.select('#axes')
    .attr('width', axesWidth)
    .attr('height', axesHeight);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + axesHeight + ')')
    .call(xAxis)
    .selectAll('text')
      .attr('transform', 'translate(10,-25)')

function zoomToRange(left, right, padding) {
  var range = right - left;
  left -= range * padding;
  right += range * padding;
  x.domain([ left, right ])
  var t = svg.transition().duration(750)
  t.select('.x.axis')
    .call(xAxis)
    .selectAll('text')
      .attr('transform', 'translate(10,-25)')
}