var width = 65,
  height = 65,
  tau = 2 * Math.PI;

var radius = 25;
var arcWidth = 7;

var arc = d3.svg.arc()
    .innerRadius(radius - arcWidth)
    .outerRadius(radius + arcWidth)
    .startAngle(0)

function setAngle(arc, arcPath, circle, newAngle, duration) {
  var offset = -tau / 4;
  var interpolate = d3.interpolate(arcPath.datum().endAngle, newAngle);
  arcPath.transition()
    .duration(duration)
    .attrTween('d', function(d) {
      return function(t) {
        d.endAngle = interpolate(t);
        return arc(d);
      }
    })
    .ease('cubic-out')
  circle.transition()
    .duration(duration)
    .attrTween('cx', function(d) {
      return function(t) {
        return Math.cos(interpolate(t)+offset) * radius;
      }
    })
    .attrTween('cy', function(d) {
      return function(t) {
        return Math.sin(interpolate(t)+offset) * radius;
      }
    })
    .ease('cubic-out')
}

function createDial(svg) {
  var group = svg
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform',
      // 'rotate(180)' +
      'translate(' + width / 2 + ',' + height / 2 + ') ');
      // + 'rotate(180)');

  var arcPath = group.append('path')
      .attr('opacity', '.80')
      .datum({endAngle: 0})
      .attr('d', arc);

  var circle = group.append('circle')
      .attr('r', arcWidth);

  var dial = {
    setAngle: function(angle, duration) {
      setAngle(arc, arcPath, circle, angle, duration);
      return dial;
    }
  };
  return dial;
}

var dialSpo2 = createDial(d3.select('#spo2-arc'))
  .setAngle(tau * 3/4, 4000)

var dialOverall = createDial(d3.select('#overall-arc'))
  .setAngle(tau * 1/2, 5000)