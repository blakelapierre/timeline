module.exports = () => {
  return {
    restrict: 'E',
    scope: {
      time: '='
    },
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.filter = 'mediumTime';

      $scope.getWidth = () => getPercentageOfDay(new Date($scope.time));
    }]
  };
};

function getPercentageOfDay(date) {
  return (((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds()) / (60 * 60 * 24);
}