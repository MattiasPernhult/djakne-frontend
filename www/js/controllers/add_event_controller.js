controllers.controller('AddEventController',
  function($scope, $http, HOST, EventFactory, $cordovaToast, httpService,
    toastService, ionicDatePicker) {

    $scope.event = {};

    $scope.modify = function(input) {
      input = Number(input);
      if (input < 10) {
        input = '0' + input;
      }
      return input;
    };

    $scope.sendPost = function() {
      var date = new Date($scope.event.date);

      var correctDate = date.getFullYear() + '-' + $scope.modify((date.getUTCMonth() + 1)) +
      '-' + $scope.modify((date.getUTCDate() + 1)) + 'T' + $scope.modify(date.getHours()) +
      ':' + $scope.modify(date.getMinutes()) + ':00';

      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: $scope.event.author,
        location: $scope.event.location,
        date: correctDate,
      };

      console.log($scope.event.date);

      var url = HOST.hostAdress + ':4000/events';
      httpService.post(url, formData, function(err, result)  {
        if (err) {
          toastService.showLongBottom(err.message);
        } else {
          toastService.showLongBottom('Eventet har skapats');
          $scope.event = {};
          EventFactory.getEvents(function() {
            return;
          });
        }
      });
    };
  });
