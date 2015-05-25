var tau = 2 * Math.PI;
var arcRadius = 25;
var arcWidth = 7;

var arc = d3.svg.arc()
    .innerRadius(arcRadius - arcWidth)
    .outerRadius(arcRadius + arcWidth)
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
        return Math.cos(interpolate(t)+offset) * arcRadius;
      }
    })
    .attrTween('cy', function(d) {
      return function(t) {
        return Math.sin(interpolate(t)+offset) * arcRadius;
      }
    })
    .ease('cubic-out')
}

function createDial(svg) {
  var width = 65,
    height = 65;

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
    setPercent: function(percent, duration) {
      duration = duration || 1000;
      setAngle(arc, arcPath, circle, tau * percent, duration);
      return dial;
    }
  };
  dial.setPercent(0,0);
  return dial;
}

var dialSpo2 = createDial(d3.select('#spo2-arc'));

var dialOverall = createDial(d3.select('#overall-arc'));