module.exports = () => {
  return {
    restrict: 'E',
    scope: false,
    template: require('./template.html'),
    controller: ['$scope', $scope => {
    }]
  };
};