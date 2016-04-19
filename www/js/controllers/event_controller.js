controllers.controller('EventController', function($scope, EventFactory, $state, $http, httpService, toastService, HOST, accessFactory) {

  $scope.isVisible = false;
  $scope.toggleElement = function() {

    if ($scope.isVisible === false) {
      $scope.isVisible = true;
    } else {
      $scope.isVisible = false;
    }
  };

  EventFactory.getEvents(function(data) {
    console.log('resultat från getEvents: ' + JSON.stringify(data, null, 4));
    $scope.events = data;
  });

  $scope.$watch(function() {
      return EventFactory.getListOfEvents();
    },
    function(newVal) {
      $scope.events = newVal;
    }
  );
  $scope.signUp = function(eventId) {
    console.log('eventId : ' + eventId);
    var url = HOST.hostAdress + ':4000/events/register/' + eventId;
    var body = {
      token: 'AQU8iSA3O7S-LyHHvukaqoE4_jb0cofoY9X-OvZ8u9YwrZMq3FkU82TvE-XQIYd7e9L7ozOT6EXQg2iZSX4GCC05vN7-73mLaxD0VriNdbRHy0Z6ApSP5cicDtJotqH-gomZidhlUWcNuZc7Pty702vfsnX5cIs8XBUUtIvDBnuP-hTk9O8',
    };

    httpService.post(url, body, function(err, result) {
      if (err) {
        toastService.showLongBottom('Något blev fel så du är ej anmäld till eventet');
      } else {
        $scope.showImage = true;
        toastService.showLongBottom('Du är nu anmäld till eventet');
      }
    });
  };
});
