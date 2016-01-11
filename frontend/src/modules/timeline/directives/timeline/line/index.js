module.exports = () => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    link($scope, element, attributes) {
    },
    controller: ['$scope', $scope => {

    }]
  };
};