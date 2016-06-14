function Line(index) {
  this.index = index;
  this.distance = 0;
  this.end = math.zeros(2);
  this.start = math.zeros(2);
  this.surface = math.zeros(2);
}
Line.prototype = {
  setEnd: function(end) {
    this.end = end;
  },
  setDist: function(dist) {
    this.distance = dist;
  },
  getIndex: function() {
    return this.index;
  },
  setStart: function(point) {
    this.start = point;
  },
  getDist: function() {
    return this.distance;
  },
  draw: function() {
    var surface_onCanvas = mapToCanvas(this.surface[0], this.surface[1]);
    var cross_onCanvas = mapToCanvas(this.end[0], this.end[1]);
    var center = mapToCanvas(vehicle.xPosition, vehicle.yPosition);
    // Draw sensor lines
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(center[0], center[1]);
    ctx.strokeStyle = "rgba(236, 90, 80,1)"
    ctx.lineTo(cross_onCanvas[0], cross_onCanvas[1]);
    ctx.closePath();
    ctx.stroke();

    // Draw the end point
    ctx.beginPath();
    ctx.arc(cross_onCanvas[0], cross_onCanvas[1], 10, 0, Math.PI*2, true)
    ctx.fillStyle = "rgba(236, 90, 80,1)";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(236, 80, 96, 1)";
    ctx.arc(cross_onCanvas[0], cross_onCanvas[1], 15, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
  },
  setSurface: function() {
    var point_x = vehicle.xPosition + RADIUS / scale * math.cos(ang_phi - math.pi / 4 + ((math.pi / 4) * this.index));
    var point_y = vehicle.yPosition + RADIUS / scale * math.sin(ang_phi - math.pi / 4 + ((math.pi / 4) * this.index));
    this.surface = [point_x, point_y];
  },
  getSur: function() {
    return this.surface;
  }
}
