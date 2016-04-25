controllers.controller('AddEventController',
  function($scope, $state, $http, HOST, EventFactory, $cordovaToast, httpService, toastService) {

    $scope.event = {};

    $scope.sendPost = function() {
      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: $scope.event.author,
        date: $scope.event.date,
        location: $scope.event.place + ', ' + $scope.event.adress,
      };

      var url = HOST.hostAdress + ':4000/events';
      httpService.post(url, formData, function(err, result)  {
        if (err) {
          toastService.showLongBottom(err.message);
        } else {
          toastService.showLongBottom('Eventet har skapats');
          $scope.event = {};
          $state.go('tab.home');
          EventFactory.getEvents(function() {
            return;
          });
        }
      });
    };
  });
