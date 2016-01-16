module.exports = () => {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return val ? parseFloat(val) : null;
      });
      ngModel.$formatters.push(function(val) {
        return val ? '' + val : null;
      });
    }
  };
};