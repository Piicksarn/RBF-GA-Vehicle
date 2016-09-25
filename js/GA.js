/**
 * @var {agentList} is an container for agents.
 * @var {groupBest} for saving the best position array.
 * @var {groupBest_value} the best value of positions.
 * @var {vmax} set the bound of the velocity.
 * @var {avgError} for saving the smallest average error of positions.
 */

var agentList = new Array();
var groupBest = new Array();
var groupBest_value = Number.MAX_VALUE;
var avgError = 10000;


function trainGA() {
  for( var i = 0; i < agentList.length; i++)
    agentList[i].calFunction();
  searchGBest();
  reproduce();
  crossover();
  mutation();
}

function searchGBest() {
  for(var i in agentList)
    if(agentList[i].getError() < groupBest_value) {
      groupBest_value = agentList[i].getError();
      groupBest = agentList[i].getPos();
      best4Test = sliceData(groupBest);
      avgError = (groupBest_value * 2) / $('#amount').val();
    }
  console.log("error-min: " + avgError);
}

function setAgent() {
  for( var i = 0; i < $('#amount').val(); i++) {
    var agent = new Agent();
    agent.initialize();
    agentList.push(agent);
  }
}

function reproduce() {
  var temp = new Array();
  var choose = 0;
  if(choose == 1 ) {
    var fitness = 0;
    var fitSum = 0;
    var error_Avg = 0;
    for(var index in agentList)
      fitSum += agentList[index].getError();
    for(var index in agentList)
      fitness += fitSum / agentList[index].getError();
    error_Avg = fitness / agentList.length;
    for(var index in agentList) {
      for(var counter = 0; counter < math.round(fitSum / agentList[index].getError()) / error_Avg; counter ++)
        temp.push(agentList[index]);
    }
    agentList = temp;
  }
  else {
    // Counter for control the amount of neuros be compare.
    var counter = math.round(math.random(1, agentList.length));
    var suit = new Array();
    for(var i = 0; i < counter; i++)
      suit.push(agentList[math.round(math.random(0, agentList.length - 1))]);
    agentList.push(checkToPool(suit));
  }
}
function crossover() {
  //Get the genes for crossover in random
  for(var i = 0; i < math.round($('#phi1').val() * agentList.length); i++) {
    var index1 = math.round(math.random(0, agentList.length - 1));
    var gene1 = agentList[index1];
    agentList.splice(index1, 1);
    var index2 = math.round(math.random(0, agentList.length - 1));
    var gene2 = agentList[index2];
    agentList.splice(index2, 1);

    //Get the exchange range
    var begin = math.round(math.random(0, agentList[0].getPos().length - 1));
    var end = math.round(math.random(1, agentList[0].getPos().length - 1));
    var tmp;
    if(math.largerEq(begin, end)) {
      tmp = begin;
      begin = end;
      end = tmp;
  }
  //Swap the element in range of begin and end
  var tmpGene1 = (gene1.getPos().slice(0, begin)).concat((gene2.getPos().slice(begin, end + 1)), gene1.getPos().slice(end + 1, gene1.getPos().length));
  var tmpGene2 = (gene2.getPos().slice(0, begin)).concat((gene1.getPos().slice(begin, end + 1)), gene2.getPos().slice(end + 1, gene2.getPos().length));
  var g1 = new Agent();
  g1.setPos(tmpGene1);
  var g2 = new Agent();
  g2.setPos(tmpGene2);
  agentList.push(g1);
  agentList.push(g2);
  }
}
function mutation() {
  for(var k = 0; k < math.round($('#phi2').val() * agentList.length); k++) {
    var index = math.round(math.random(0, agentList.length - 1));
    var para = sliceData(agentList[index].getPos());
    agentList.splice(index, 1);

    var muPart = math.round(math.random(0, 3));
    switch(muPart) {
      case 0:
        para[0] += math.random(-1, 1);
        para[0] = bound(para[0], 1, 0);
        break;
      case 1:
        var i = math.round(math.random(0, para[1].length -1));
        para[1][i] += math.random(-40, 40);
        para[1][i] = bound(para[1][i], 40, -40);
        break;
      case 2:
        var i = math.round(math.random(0, para[2].length -1));
        var j = math.round(math.random(0, para[2][i].length -1));
        var tmp = para[2][i];
        tmp[j] += math.random(-30, 30);
        tmp[j] = bound(tmp[j], 30, 0);
        para[2][i] = tmp;
        break;
      case 3:
        var i = math.round(math.random(0, para[1].length -1));
        para[3][i] += math.random(-10, 10);
        para[3][i] = bound(para[3][i], 10, 0);
        break;
    }
    var temp = para[2][0];
    for(var i in para[2])
      if(i != 0)
        temp = temp.concat(para[2][i]);
    var gene = [para[0]];
    gene = gene.concat(para[1], temp, para[3]);
    var g = new Agent();
    g.setPos(gene);
    g.calFunction();
    agentList.push(g);
  }
}
function bound(value, max, min) {
  if(value > max)
    value = max;
  if(value < min)
    value = min;
  return value;
}
function checkToPool(agents) {
  var temp;
  var min = Number.MAX_VALUE;
  for(var i in agents) {
    if(agents[i].getError() < min)
      temp = agents[i];
  }
  return temp;
}
