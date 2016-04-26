module.exports = () => {
  return {
    restrict: 'E',
    scope: {
      time: '='
    },
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.filter = 'mediumTime';

      $scope.getWidth = () => {
        const now = new Date($scope.time);

        return (((now.getHours() * 60 + now.getMinutes()) * 60) + now.getSeconds()) / (60 * 60 * 24);
      };
    }]
  };
};