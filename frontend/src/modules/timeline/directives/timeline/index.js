module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', '$interval', '$timeout', ($scope, $interval, $timeout) => {
      $scope.items = [
        {
          time: new Date(),
          endTime: new Date(new Date().getTime() + 1000 * 2),
          type: 'startup',
          text: 'startup'
        }
      ];

      $scope.offsetTotal = 1000 * 60 * 5;
      $scope.offsetHalf = $scope.offsetTotal / 2;

      $scope.timeCurrent = new Date();
      $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent.getTime() + $scope.offsetHalf) - $scope.offsetTotal;
      $scope.offsetBegin = new Date($scope.offsetBegin);
      $scope.offsetEnd = new Date($scope.offsetEnd);

      $scope.lineStyle = {
        top: 0
      };

      $scope.lineTimeOffset = 0;

      $scope.option = {timeDecimals: 3};
      $scope.newItem = {
        isNew: false
      };
      $scope.isNew = true;

      $scope.getDuration = item => (item.endTime || new Date()).getTime() - item.time;

      $scope.newItemChanged = newValue => {
        if ($scope.isNew) initializeNewItem();

        function initializeNewItem() {
          $scope.isNew = false;
          $scope.newItem.time = new Date();
          $scope.items.push($scope.newItem);
        }
      };

      $scope.newItemKeypress = $event => {
        if ($event.keyCode === 13) $scope.addNewItem();
      };

      $scope.addNewItem = () => {
        $scope.isNew = true;
        $scope.newItem.endTime = new Date();
        $scope.newItem = {};
      };

      $scope.wheelCurrent = $event => {
        $scope.offsetTotal = Math.max(1000 * 5, $scope.offsetTotal + $event.deltaY * 1000);

        $scope.offsetHalf = $scope.offsetTotal / 2;

        $scope.timeCurrent = new Date();
        $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent.getTime() + $scope.offsetHalf) - $scope.offsetTotal;
        $scope.offsetBegin = new Date($scope.offsetBegin);
        $scope.offsetEnd = new Date($scope.offsetEnd);
      };

      $scope.wheelTime = $event => {
        $scope.lineTimeOffset -= $event.deltaY * 100;
        setTime($scope);
      };

      $scope.goToNow = () => {
        $scope.lineTimeOffset = 0;
        setTime($scope);
      };

      $scope.updateRate = 10;
      $interval(() => setTime($scope), 1000 / $scope.updateRate);
      $timeout(() => setTime($scope), 0);

      console.log('timeline', $scope);
    }]
  };
};

function setTime($scope) {
  $scope.timeCurrent = new Date(new Date().getTime() - $scope.lineTimeOffset);

  $scope.timeBegin = $scope.timeCurrent.getTime() - $scope.offsetHalf;
  $scope.timeEnd =  $scope.timeCurrent.getTime() + $scope.offsetHalf;

  $scope.lineOffset = -($scope.timeBegin - $scope.offsetBegin.getTime()) / $scope.offsetTotal;
  $scope.lineStyle.top = $scope.lineOffset * 100 + '%';
}