controllers.controller('EventController', function($scope, EventFactory, $state) {

  $scope.isVisible = false;
  $scope.toggleElement = function() {

    if ($scope.isVisible === false) {
      $scope.isVisible = true;
    } else {
      $scope.isVisible = false;
    }
  };

  EventFactory.getEvents(function(data) {
    $scope.events = data;
  });

  $scope.$watch(function() {
      return EventFactory.getListOfEvents();
    },
    function(newVal) {
      $scope.events = newVal;
    }
  );
  $scope.setEvent = function(chosenEvent) {
    EventFactory.setEvent(chosenEvent);
  };
  $scope.gotoeventMain = function() {
    $state.go('eventMain');
  };
  $scope.gotoBoard = function() {
    $state.go('boardMain');
  };
  $scope.gotoNews = function() {
    $state.go('newsMain');
  };
  $scope.gotoMembership = function() {
    $state.go('memberships');
  };
});
