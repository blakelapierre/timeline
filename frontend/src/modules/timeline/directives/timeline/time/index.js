module.exports = ['$swipe', $swipe => {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    template: require('./template.html'),
    link($scope, element, attributes) {
      // $swipe.bind(element, {
      //   start:  event => console.log('start', event),
      //   move:   event => console.log('move', event),
      //   end:    event => console.log('end', event),
      //   cancel: event => console.log('cancel', event),
      // });
    }
  };
}];