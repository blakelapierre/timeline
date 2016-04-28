module.exports = () => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    link($scope, element, attributes) {
      // fails horibly if more than one day between begin and end
      $scope.getTimeScaleBackground = () => `linear-gradient(rgba(255, 255, 255, ${getLightAlpha($scope.timeBegin)}) 0%,
                                                             rgba(255, 255, 255, ${getLightAlpha($scope.timeCurrent)}) 50%,
                                                             rgba(255, 255, 255, ${getLightAlpha($scope.timeEnd)}) 100%)`;
    }
  };
};

function getPercentageOfDay(date) {
  return (((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds()) / (60 * 60 * 24);
}

function getLightAlpha(time) {
  return Math.sin(-(Math.PI / 2) * (1 - 4 * getPercentageOfDay(new Date(time)))) / 2 + 0.5;
}