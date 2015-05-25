var width = 400,
  height = 400,
  tau = 2 * Math.PI;

var radius = 25;
var arcWidth = 7;

var arc = d3.svg.arc()
    .innerRadius(radius - arcWidth)
    .outerRadius(radius + arcWidth)
    .startAngle(0)

function setAngle(arc, arcPath, circle, newAngle) {
  var offset = -tau / 4;
  var interpolate = d3.interpolate(arcPath.datum().endAngle, newAngle);
  arcPath.transition()
    .duration(2000)
    .attrTween('d', function(d) {
      return function(t) {
        d.endAngle = interpolate(t);
        return arc(d);
      }
    })
  circle.transition()
    .duration(2000)
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
}

function createDial(svg) {
  var group = svg
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform',
      'translate(' + width / 2 + ',' + height / 2 + ') '//);
      + 'rotate(180)');

  var arcPath = group.append('path')
      .attr('fill', 'url(#gradient)')
      .attr('opacity', '.80')
      .datum({endAngle: 0})
      .attr('d', arc);
      
  var circle = group.append('circle')
      .attr('r', arcWidth);

  return {
    setAngle: function(angle) {
      setAngle(arc, arcPath, circle, angle);
    }
  };
}

var dialSpo2 = createDial(d3.select('#spo2-arc'));
dialSpo2.setAngle(tau * 3/4);