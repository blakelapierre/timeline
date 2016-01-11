module.exports = () => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      console.log($scope);
    }]
  };
};