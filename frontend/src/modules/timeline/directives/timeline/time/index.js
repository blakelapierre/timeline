module.exports = ['$swipe', $swipe => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    link($scope, element, attributes) {
      let startY;
      $swipe.bind(element, {
        start:  ({x, y}) => startY = y,
        move:   ({x, y}) => {console.log(y, startY); $scope.setLineTimeOffset($scope.lineTimeOffset + (1 / (y - startY)) * $scope.offsetTotal);},
        end:    event => console.log('end', event),
        cancel: event => console.log('cancel', event),
      });
    }
  };
}];