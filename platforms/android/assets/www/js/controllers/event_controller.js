controllers.controller('EventController', function($scope, EventFactory, $state,
   $http, httpService, toastService, HOST, accessFactory, ProfileFactory) {
  // $scope.userComment = {};

  $scope.go = function(name, event) {
    // var userObj = $scope.user;
    var eventObj = event;
    $state.go(name, {eventParam: eventObj});
  };

  // ProfileFactory.getUser(function(data) {
  //   $scope.user = JSON.parse(data);
  // });
  //
  // $scope.addComment = function(eventId) {
  //   var text = $scope.userComment.text;
  //   EventFactory.addComment(eventId, text, function(err, result) {
  //     if (err) {
  //       toastService.showLongBottom(err.error);
  //     } else {
  //       $scope.userComment.text = null;
  //       EventFactory.updateEventList(result.event);
  //       $scope.show = true;
  //     }
  //   });
  // };

  // $scope.removeComment = function(eventId, commentId) {
  //   EventFactory.removeComment(eventId, commentId, function(err, result) {
  //     if (err) {
  //       toastService.showLongBottom(err.error);
  //     } else {
  //       EventFactory.updateEventList(result.event);
  //       $scope.show = true;
  //     }
  //   });
  // };

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
});