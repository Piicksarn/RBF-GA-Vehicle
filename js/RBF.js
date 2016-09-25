function rbf(theta, weight, mean, sigma) {
  var result = theta;
  var errorSum = 0;
  for(var dataIndex in dataList) {
    result = theta;
    for(var i in mean) {
      var norm = 0;
      for(var j in mean[i]) {
        norm += Math.pow((dataList[dataIndex][i] - mean[i][j]), 2);
      }
      result = result + weight[i] * Math.exp((-0.5) * norm / (sigma[i] * sigma[i]));
    }
    errorSum = errorSum + math.abs(dataList[dataIndex][dataLgn - 1] - result);
  }
  return Math.pow(errorSum, 2) / 2;
}
