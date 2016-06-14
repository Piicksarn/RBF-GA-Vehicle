$(function() {
  setWalls();
  drawMap();
  $(".menu").toggleClass("closed");
  $('#startBtn').hide();
});
$("#go").click(function(e) {
  requestAnimationFrame(refresh);
});

$("#bg input").change(function() {
  if($('input[name="myRadio"]:checked', '#bg').val()== 2)
    mapIndex = 2;
  else if($('input[name="myRadio"]:checked', '#bg').val()== 1)
    mapIndex = 1;
  else if($('input[name="myRadio"]:checked', '#bg').val()== 3)
    mapIndex = 3;
  set = false;
  clear();
  drawMap();
});

var best4Test = new Array();
var ang_phi = 90;
var ang = 0;
function newPosition() {
  var theta = 0;
  var para = best4Test;
  var data = new Array();
  var result = para[0];
  if(dataLgn == 6) {
    data.push(vehicle.xPosition);
    data.push(vehicle.yPosition);
  }
  data.push(lineList[1].getDist());
  data.push(lineList[0].getDist());
  data.push(lineList[2].getDist());

  result = para[0];
  for(var i in para[2]) {
    var norm = 0;
    for(var j in para[2][i])
      norm += Math.pow((data[i] - para[2][i][j]), 2);
    result = result + para[1][i] * Math.exp((-0.5) * norm / (para[3][i] * para[3][i]));
  }
  theta = result;
  ang = theta;
  var x = math.add(math.cos(ang_phi + (theta * math.pi / 180)), math.sin(theta * math.pi / 180) * math.sin(ang_phi));
  x = math.add(vehicle.xPosition, x);
  var y = math.subtract(math.sin(ang_phi + (theta * math.pi / 180)), math.sin(theta * math.pi / 180) * math.cos(ang_phi));
  y =  math.add(vehicle.yPosition, y);
  ang_phi = ang_phi - math.asin(2 * math.sin(theta * math.pi / 180) / 3);
  return [x, y];
}

function sliceData(dataArray) {
  var mean = new Array(neuroNum);
  var theta = dataArray[0];
  var weight = dataArray.slice(1,neuroNum + 1);
  var meanBegin = 1 + neuroNum;
  var meanEnd = meanBegin + dataLgn - 1;
  for(var i = 0; i < neuroNum; i++) {
    mean[i] = dataArray.slice(meanBegin, meanEnd);
    meanBegin = meanEnd;
    meanEnd = meanBegin + dataLgn - 1;
  }
  var sigma = dataArray.slice(meanBegin, dataArray.length);
  return [theta, weight, mean, sigma];
}

function inBound(x , y) {
  if( x - 3 * scale < mapToCanvas(-6, 0)[0])
    return false;
  if( x + 3 * scale > mapToCanvas(30, 0)[0])
    return false;
  if( x - 3 * scale > mapToCanvas(-6, 0)[0] && y - 3 * scale < mapToCanvas(0, 22)[1] && x - 3 * scale < mapToCanvas(18, 0)[0])
    return false;
  if( x + 3 * scale > mapToCanvas(6, 0)[0] && y + 3 * scale > mapToCanvas(0, 10)[1] && x + 3 * scale < mapToCanvas(30, 0)[0])
      return false;
  return true;
}

function calDist(center, surface, line) {
  var interList = new Array();
  for (var i = 0; i < wallList.length; i++) {
    var intPoint = intersect(center, surface, wallList[i]);
      if(intPoint != null)
        interList.push(intPoint);
  }
  var min = 300;
  for (var i = 0; i < interList.length; i++) {
    if(math.distance(interList[i], center) < min) {
      min = math.distance(interList[i],[vehicle.xPosition, vehicle.yPosition]);
      line.setEnd(interList[i]);
      line.setDist(min);
    }
  }
}
function intersect(start, end, wall) {
    var crossPnt = math.round(math.intersect(start, end, wall.getSP(), wall.getEP()));
    var inRage = false;
    if(onLine(crossPnt))
       if(math.dot([(end[0] - start[0]), (end[1] - start[1])], [(crossPnt[0] - start[0]), (crossPnt[1] - start[1])]) > 0) {
           wall.getStyle() == 'y' ? inRage = checkInBound(crossPnt[0], wall) : inRage = checkInBound(crossPnt[1], wall);
           if(inRage)
             return math.round(math.intersect(start, end, wall.getSP(), wall.getEP()));
       }
    return null;
}

function onLine(point) {
  var value = point[0];
  var value2 = point[1];
  for( var i in wallList) {
      if(value == wallList[i].getMax() || value == wallList[i].getMin() ||
         value == wallList[i].getX() || value == wallList[i].getX())
        return true;
      if(value2 == wallList[i].getMax() || value2 == wallList[i].getMin() ||
           value2 == wallList[i].getX() || value2 == wallList[i].getX())
        return true;
  }
  return false;
}
function checkInBound(x, wall) {
  if(x >= wall.getMin() && x <= wall.getMax())
      return true;
  return false;
}

function refresh() {
  setTimeout(function() {
    if(set) {
      clear();
      drawMap();
      var pos = newPosition();
      while(lineList.length > 0)
        lineList.pop();
      vehicle.xPosition = pos[0];
      vehicle.yPosition = pos[1];
      setLine(vehicle.xPosition, vehicle.yPosition);
      drawVehicle(mapToCanvas(vehicle.xPosition, vehicle.yPosition)[0], mapToCanvas(vehicle.xPosition, vehicle.yPosition)[1]);
      if(pos[1] + 4  >= 37)
        set = false;
      requestAnimationFrame(refresh);
    }
    $('#xpos').text(" X pos : " + math.round(vehicle.xPosition));
    $('#ypos').text(" Y pos : " + math.round(vehicle.yPosition));
    $('#angle').text("Angle : " + math.round(ang));
 }, 100 );
}
