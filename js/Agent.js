var Agent = function(){
  // Variable for PSO training
  this.position = new Array();
  this.velocity = new Array();
  this.best = new Array();
  this.best_value = Number.MAX_VALUE;

  // Variable for calculate the Error
  this.Error = 0;
  this.weight = new Array();
  this.mean = new Array();
  this.sigma = new Array();
  this.theta = 0;
};
var neuroNum = 3; //neuro number. In this program, I decided to set it with 3.
Agent.prototype = {
  /**
   * @name initialize
   * @function A function for initialize the element of the system
   */
  initialize: function() {
    var agent_Pos = new Array();
    var mean = new Array(neuroNum); //set to be p*j matrix. Each element is in range 0 ~ 30.
    var sigma = new Array(neuroNum); //the size of sigma is the same with neuroNum. Each element is in range 0 ~ 10
    var theta = Math.random(); //is a random number in range 0 - 1.
    var weight = new Array(neuroNum); //-40 ~ 40

    for(var i = 0; i < sigma.length; i++) {
      sigma[i] = Math.floor((Math.random() * 10) + 1);
      weight[i] = Math.floor((Math.random() * 80) - 40);
      var temp = new Array(dataLgn - 1);
      for(var j = 0; j < temp.length; j++)
        temp[j] = Math.floor((Math.random() * 30));
      mean[i] = temp;
    }

    agent_Pos.push(theta);
    for(var i in weight) {
      agent_Pos.push(weight[i]);
    }
    for(var i in mean) {
      for(var j in mean[i])
        agent_Pos.push(mean[i][j]);
    }
    for(var i in sigma) {
      agent_Pos.push(sigma[i]);
    }
    this.position = agent_Pos;
    this.weight = weight;
    this.mean = mean;
    this.sigma = sigma;
    this.theta = theta;
    this.velocity.length = agent_Pos.length;
    this.velocity.fill(0);
    this.best = this.position;
  },
  getError: function() {
    return this.Error;
  },
  getPos: function() {
    return this.position;
  },
  updatePos: function() {
    for(var i in this.position)
      this.position[i] = this.position[i] + this.velocity[i];
    this.updateBest();
  },
  updateBest: function() {
    if(this.Error < this.best_value) {
      this.best = this.position;
      this.best_value = this.Error;
    }
  },
  updateVel: function(agentG) {
    var alpha = Math.random();
    for(var i in this.velocity) {
      this.velocity[i] = alpha * this.velocity[i]
                         + $('#phi1').val() * (this.best[i] - this.position[i])
                         + $('#phi2').val() * (agentG[i] - this.position[i]);
      if(this.velocity[i] > vMax)
          this.velocity[i] = vMax;
      if(this.velocity[i] < -vMax)
          this.velocity[i] = -vMax;
    }
    this.updatePos();
  },
  calFunction: function() {
    var para = sliceData(this.position);
    this.Error = rbf(para[0], para[1], para[2], para[3]);
  }
}
