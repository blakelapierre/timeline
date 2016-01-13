module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', '$interval', '$timeout', ($scope, $interval, $timeout) => {
      const startupTime = new Date();
      $scope.items = [
        {
          time: startupTime,
          endTime: new Date(startupTime.getTime() + 1),
          type: 'startup',
          text: 'startup'
        }
      ];

      $scope.utcAdjustment = new Date().getTimezoneOffset() * 60 * 1000;
      $scope.offsetTotal = 1000 * 60 * 5;
      $scope.offsetHalf = $scope.offsetTotal / 2;

      $scope.timeCurrent = new Date();
      $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent.getTime() + $scope.offsetHalf) - $scope.offsetTotal;
      $scope.offsetBegin = new Date($scope.offsetBegin);
      $scope.offsetEnd = new Date($scope.offsetEnd);

      $scope.lineStyle = {
        top: 0
      };

      $scope.timeDayLocationBarStyle = {top: 0, height: '20%'};

      $scope.lineTimeOffset = 0;

      $scope.option = {timeDecimals: 0};
      $scope.updateRate = 1;

      // $scope.option = {timeDecimals: 1};
      // $scope.updateRate = 10;

      // $scope.option = {timeDecimals: 2};
      // $scope.updateRate = 30;

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
        $scope.offsetTotal = Math.max(1000 * 5, $scope.offsetTotal + $event.deltaY * 10000);

        $scope.offsetHalf = $scope.offsetTotal / 2;

        $scope.timeCurrent = new Date();
        $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent.getTime() + $scope.offsetHalf) - $scope.offsetTotal;
        $scope.offsetBegin = new Date($scope.offsetBegin);
        $scope.offsetEnd = new Date($scope.offsetEnd);

        $scope.$apply(() => setTime($scope));

        $event.stopPropagation();
      };

      $scope.wheelTime = $event => {
        $scope.lineTimeOffset -= $event.deltaY * 100000;

        $scope.$apply(() => setTime($scope));

        $event.stopPropagation();
      };

      $scope.touchTime = $event => console.log({$event});

      $scope.goToNow = () => {
        $scope.lineTimeOffset = 0;
        setTime($scope);
        $scope.$apply(() => setTime($scope));
      };

      $interval(() => setTime($scope), 1000 / $scope.updateRate);
      $timeout(() => setTime($scope), 0);

      console.log('timeline', $scope);
    }]
  };
};

function setTime($scope) {
  const now = new Date().getTime();

  $scope.startOfDay = startOfDay().getTime();
  $scope.timeCurrent = new Date(now - $scope.lineTimeOffset);

  $scope.timeBegin = $scope.timeCurrent.getTime() - $scope.offsetHalf;
  $scope.timeEnd =  $scope.timeCurrent.getTime() + $scope.offsetHalf;

  $scope.lineOffset = -($scope.timeBegin - $scope.offsetBegin.getTime()) / $scope.offsetTotal;
  $scope.lineStyle.top = $scope.lineOffset * 100 + '%';

  $scope.timeDayLocationBarStyle.top = ($scope.timeCurrent - $scope.startOfDay) / (1000 * 60 * 60 * 24) * 100 + '%';
  $scope.timeDayLocationBarStyle.height = $scope.offsetTotal / (1000 * 60 * 60 * 24) * 100 + '%';
}

function startOfDay() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
}