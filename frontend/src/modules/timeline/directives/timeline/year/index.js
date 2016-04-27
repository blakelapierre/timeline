module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      // $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${((new Date($scope.now).getHours() - 12) % 23 ) / 23})`;
      // $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${Math.cos(new Date($scope.now).getHours() / 23)})`;
      // $scope.getInverseTimeOfDayColor = () => `rgba(255, 255, 255, ${1 - Math.cos(new Date($scope.now).getHours() / 23)})`;

      $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${Math.cos(new Date($scope.now).getHours() / 23)})`;
      $scope.getInverseTimeOfDayColor = () => `rgba(255, 255, 255, 1)`;

      $scope.getDayMarkerPosition = () => `${(new Date($scope.now) - new Date(new Date($scope.now).getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24) / 365 * 100}%` ; // doesn't handle leap years!
    }]
  };
};