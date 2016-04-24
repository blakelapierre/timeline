module.exports = ['$window', $window => {
  $window.$on('keydown', $event => console.log($event));
}];