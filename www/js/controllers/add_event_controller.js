controllers.controller('AddEventController',
  function($scope, $state, $http, HOST, EventFactory, $cordovaToast, httpService, toastService) {
    $scope.event = {};

    $scope.change = function() {
      $scope.event.djakne = ($scope.event.djakne) ? true : false;
      $scope.show = $scope.event.djakne;
    };

    $scope.resetCustomLocation = function() {
      $scope.event.place = null;
      $scope.event.adress = null;
    };

    $scope.sendPost = function() {
      var place = '';

      if ($scope.event.place && $scope.event.adress) {
        place = $scope.event.place + ', ' + $scope.event.adress;
      } else {
        place = 'Djäkne';
      }
      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: $scope.event.author,
        date: $scope.event.date,
        location: place,
      };

      var url = HOST.hostAdress + ':4000/events';
      httpService.post(url, formData, function(err, result)  {
        if (err) {
          toastService.showLongBottom(err.message);
        } else {
          toastService.showLongBottom('Event was created');
          $scope.event = {};
          $state.go('tab.home');
          EventFactory.getEvents(function() {
            return;
          });
        }
      });
    };
  });
