
module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    controller: ['$scope', '$interval', '$timeout', 'timelineData',
                 ($scope, $interval, $timeout, timelineData) => {
      // addStartupItem(timelineData);

      $scope.items = timelineData.getItems();

      $scope.options = {
        timeDecimals: 0,

        updateRate: 0.2,

        dayStartUTCOffset: 0,

        defaultViewPeriod: 1000 * 60 * 2
      };

      $scope.lengthOfDay = 1000 * 60 * 60 * 24; // 1000ms/s * 60s/m * 60m/h * 24h/d = 86,400,000ms/d

      $scope.utcAdjustment = new Date().getTimezoneOffset() * 60 * 1000;
      $scope.offsetTotal = $scope.options.defaultViewPeriod;
      $scope.offsetHalf = $scope.offsetTotal / 2;

      $scope.timeCurrent = new Date();
      $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent.getTime() + $scope.offsetHalf) - $scope.offsetTotal;
      $scope.offsetBegin = new Date($scope.offsetBegin);
      $scope.offsetEnd = new Date($scope.offsetEnd);

      $scope.lineStyle = {
        top: 0
      };

      $scope.timeDayLocationBarStyle = {top: 0, height: '20%'};
      $scope.timeDayLocationOverflowBarStyle = {top: 0, height: '5%'};

      $scope.lineTimeOffset = 0;

      $scope.newItem = {};
      $scope.isNew = true;

      $scope.getDuration = item => (item.endTime || new Date().getTime()) - item.time;

      $scope.newItemChanged = newValue => {
        if ($scope.isNew) initializeNewItem();

        function initializeNewItem() {
          $scope.isNew = false;
          $scope.newItem.time = new Date();
          // $scope.items.push($scope.newItem);
          $scope.currentItem = addGenericItem(timelineData, $scope.newItem);
          // timelineData.addItem($scope.newItem);
        }
      };

      $scope.newItemKeypress = $event => {
        if ($event.keyCode === 13) $scope.addNewItem();
        if ($scope.currentItem) updateItem(timelineData, $scope.currentItem, $scope.newItem);
      };

      $scope.endItem = item => timelineData.endItem(item);

      $scope.addNewItem = () => {
        $scope.isNew = true;
        $scope.newItem = {};
      };

      $scope.wheelCurrent = $event => {
        $scope.offsetTotal = Math.round(Math.max(1000 * 5, $scope.offsetTotal + $event.deltaY * $scope.offsetTotal / 1000));

        $scope.offsetHalf = $scope.offsetTotal / 2;

        $scope.timeCurrent = new Date().getTime();
        $scope.offsetBegin = ($scope.offsetEnd = $scope.timeCurrent + $scope.offsetHalf) - $scope.offsetTotal;
        $scope.offsetBegin = new Date($scope.offsetBegin);
        $scope.offsetEnd = new Date($scope.offsetEnd);

        $scope.$apply(() => setTime($scope));

        $event.stopPropagation();
      };

      $scope.wheelTime = $event => {
        $scope.lineTimeOffset -= 1 / $event.deltaY * $scope.offsetTotal;

        $scope.$apply(() => setTime($scope));

        $event.stopPropagation();
      };

      $scope.touchTime = $event => console.log({$event});

      $scope.goToNow = () => {
        $scope.lineTimeOffset = 0;
        setTime($scope);
      };

      $interval(() => setTime($scope), 1000 / $scope.options.updateRate);
      $timeout(() => setTime($scope), 0);

      console.log('timeline', $scope);

      function addStartupItem(timelineData) {
        const startupTime = new Date();
        return timelineData.endItem(
          timelineData.addItem(startupTime, {
            type: 'startup',
            text: 'startup'
          }),
          new Date(startupTime.getTime() + 1)
        );
      }

      function addGenericItem(timelineData, item) {
        return timelineData.addItem(item.time, {
          type: 'generic',
          text: item.text
        });
      }

      function updateItem(timelineData, item, data) {
        return timelineData.updateItem(item, data);
      }
    }]
  };
};

function setTime($scope) {
  $scope.now = new Date().getTime();

  $scope.startOfDay = startOfDay().getTime();
  $scope.timeCurrent = new Date($scope.now - $scope.lineTimeOffset).getTime();

  $scope.timeBegin = $scope.timeCurrent - $scope.offsetHalf;
  $scope.timeEnd =  $scope.timeCurrent + $scope.offsetHalf;

  $scope.lineOffset = -($scope.timeBegin - $scope.offsetBegin.getTime()) / $scope.offsetTotal;
  $scope.lineStyle.top = $scope.lineOffset * 100 + '%';

  $scope.timeDayLocationBarStyle.top = (($scope.timeBegin - $scope.startOfDay) % $scope.lengthOfDay) / $scope.lengthOfDay * 100 + '%';
  $scope.timeDayLocationBarStyle.height = Math.min(1, $scope.offsetTotal / $scope.lengthOfDay) * 100 + '%';

  if ($scope.timeEnd > $scope.startOfDay + $scope.lengthOfDay) {
    // will need to wrap/show second bar
    // $scope.timeDayLocationOverflowBarStyle.top = ($scope.timeBegin - $scope.startOfDay) / $scope.lengthOfDay * 100 + '%';
    $scope.timeDayLocationOverflowBarStyle.height = Math.min(1, (($scope.timeEnd - $scope.startOfDay - $scope.lengthOfDay) % $scope.lengthOfDay) / $scope.lengthOfDay) * 100 + '%';
  }
  else $scope.timeDayLocationOverflowBarStyle.height = 0;
}

function startOfDay() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
}