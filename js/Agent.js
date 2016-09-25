var Agent = function(){
  this.position = new Array();
  this.slicePos = new Array();
  this.Error = 0;
};
var neuroNum = 3; //neuro number. In this program, I decided to set it with 3.
Agent.prototype = {
  initialize: function() {
    var agent_Pos = [Math.random()];
    var mean = new Array(neuroNum); //set to be p*j matrix. Each element is in range 0 ~ 30.
    var sigma = new Array(neuroNum); //the size of sigma is the same with neuroNum. Each element is in range 0 ~ 10
    var weight = new Array(neuroNum); //-40 ~ 40

    for(var i = 0; i < neuroNum; i++) {
      sigma[i] = Math.floor((Math.random() * 10) + 1);
      weight[i] = Math.floor((Math.random() * 80) - 40);
      var temp = new Array(dataLgn - 1);
      for(var j = 0; j < temp.length; j++)
        temp[j] = Math.floor((Math.random() * 30));
      mean[i] = temp;
    }
    var tmp = mean[0];
    for(var i in mean)
      if(i != 0)
        tmp = tmp.concat(mean[i]);
    agent_Pos = agent_Pos.concat(weight, tmp, sigma);
    this.position = agent_Pos;
    this.velocity = math.zeros(agent_Pos.length);
  },
  getError: function() {
    return this.Error;
  },
  getPos: function() {
    return this.position;
  },
  getSlice: function() {
    return this.slicePos;
  },
  updatePos: function() {
    for(var i in this.position)
      this.position[i] = this.position[i] + this.velocity[i];
    this.updateBest();
  },
  setPos: function(pos) {
    this.position = pos;
  },
  calFunction: function() {
    var para = sliceData(this.position);
    this.slicePos = para;
    this.Error = rbf(para[0], para[1], para[2], para[3]);
  }
}
