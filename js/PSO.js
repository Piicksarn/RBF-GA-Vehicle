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
var vMax = 20;
var avgError = 10000;

function trainPSO() {
  for( var i = 0; i < agentList.length; i++) {
    agentList[i].calFunction();
  }
  searchGBest();
  updateVelocity();
 }

function searchGBest() {
  for(var i in agentList)
    if(agentList[i].getError() < groupBest_value) {
      groupBest_value = agentList[i].getError();
      groupBest = agentList[i].getPos();
      best4Test = sliceData(groupBest);
      avgError = (groupBest_value * 2) / $('#amount').val();
    }
}

function updateVelocity() {
  for(var i in agentList)
    agentList[i].updateVel(groupBest);
}

function setAgent() {
  for( var i = 0; i < $('#amount').val(); i++) {
    var agent = new Agent();
    agent.initialize();
    agentList.push(agent);
  }
}
