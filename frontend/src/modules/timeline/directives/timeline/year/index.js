module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.currentDay = toDayName(new Date($scope.now).getDay());
    }]
  };
};

function toDayName(dayNumber) {
  switch (dayNumber) {
    case 0: return 'sunday';
    case 1: return 'monday';
    case 2: return 'tuesday';
    case 3: return 'wednesday';
    case 4: return 'thursday';
    case 5: return 'friday';
    case 6: return 'saturday';
  }
}