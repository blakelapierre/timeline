require('angular');
require('angular-touch');

module.exports = {
  'timeline':  angular.module('timeline', ['ngTouch'])
    .directive('timeline',     require('./directives/timeline'))
    .directive('time',         require('./directives/timeline/time'))
    .directive('line',         require('./directives/timeline/line'))
    .directive('item',         require('./directives/timeline/item'))
    .directive('itemAdder',    require('./directives/timeline/item-adder'))
    .directive('ngWheel',      require('./directives/ngWheel'))
};