module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', $scope => {
      // $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${((new Date($scope.now).getHours() - 12) % 23 ) / 23})`;
      // $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${Math.cos(new Date($scope.now).getHours() / 23)})`;
      // $scope.getInverseTimeOfDayColor = () => `rgba(255, 255, 255, ${1 - Math.cos(new Date($scope.now).getHours() / 23)})`;

      // $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, ${Math.cos(new Date($scope.now).getHours() / 23)})`;
      $scope.getTimeOfDayColor = () => `rgba(255, 255, 255, 0)`;
      $scope.getInverseTimeOfDayColor = () => `rgba(255, 255, 255, 1)`;

      $scope.getDayMarkerPosition = () => `${($scope.nowDate - new Date(new Date($scope.now).getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24) / 365 * 100}%` ; // doesn't handle leap years!

      $scope.currentMonth = toMonthName($scope.nowDate.getMonth());
    }]
  };
};

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

function toMonthName(monthNumber) {
  return months[monthNumber];
}