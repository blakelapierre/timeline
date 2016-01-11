module.exports = () => {
  return {
    restrict: 'A',
    scope: false,
    link($scope, element, attributes) {
      console.log(element, $scope);

      element.on('mousewheel', wheel);
      // element.on('wheel', wheel);

      // $scope.$on('$destroy', element.off('wheel', wheel));
      $scope.$on('$destroy', () => element.off('mousewheel', wheel));

      let evalStatement = attributes['ngWheel'];

      attributes.$observe('ngWheel', value => console.log(value));

      function wheel($event) {
        console.log($event, evalStatement, attributes);
        if (evalStatement) $scope.$eval(evalStatement, {$event});
      }
    }
  };
};