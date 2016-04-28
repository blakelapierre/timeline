import suncalc from '../../../../../util/suncalc';

module.exports = () => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    link($scope, element, attributes) {
      // fails horibly if more than one day between begin and end
      $scope.getTimeScaleBackground = () => `linear-gradient(${gradient(20, getLightAlpha, $scope.timeBegin, $scope.timeEnd)})`;
      // $scope.getTimeScaleBackground = () => `linear-gradient(rgba(255, 255, 255, ${getLightAlpha($scope.timeBegin)}) 0%,
      //                                                        rgba(255, 255, 255, ${getLightAlpha($scope.timeCurrent)}) 50%,
      //                                                        rgba(255, 255, 255, ${getLightAlpha($scope.timeEnd)}) 100%)`;
    }
  };
};

function gradient(count, fn, start, end) {
  const unit = 1 / (count - 1);

  const components = new Array(count);

  for (let i = 0; i < count; i++) components[i] = `rgba(255, 255, 255, ${fn(new Date(start + (end - start) * unit * i))}) ${unit * i * 100}%`;
console.log(components);
  return components.join(',');

  // return (new Array(count))
  //           .map((_, i) => `rgba(255, 255, 255, ${fn(new Date(start + (end - start) * unit * i))} ${unit * i * 100}%`)
  //           .join(',');
}

function getPercentageOfDay(date) {
  return (((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds()) / (60 * 60 * 24);
}

function getLightAlpha(time) {
  const times = suncalc.getTimes(new Date(time), 0, 0);

  console.log(times);

  return Math.sin(-(Math.PI / 2) * (1 - 4 * getPercentageOfDay(new Date(time)))) / 4 + 0.25;
}