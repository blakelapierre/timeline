module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      $scope.currentDay = toDayName(new Date($scope.now).getDay());

      $scope.getTimeMarkerPosition = () => {
        const date = new Date($scope.now);

        return `${(date.getDay() / 7 + date.getHours() / 24 / 7 + date.getMinutes() / 60 / 24 / 7 + date.getSeconds() / 60 / 60 / 24 / 7) * 100}%` ; // doesn't handle leap years!?
      };
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