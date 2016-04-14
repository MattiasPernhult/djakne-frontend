controllers.controller('AddEventController',
  function($scope, $http, HOST, EventFactory, $cordovaToast, httpService,
    toastService, ionicDatePicker) {

    $scope.event = {};

    $scope.sendPost = function() {
      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: $scope.event.author,
        date: $scope.event.date,
      };

      var url = HOST.hostAdress + ':4000/events';
      httpService.post(url, formData, function(err, result)  {
        if (err) {
          toastService.showLongBottom(err.message);
        } else {
          toastService.showLongBottom('Eventet har skapats');
          EventFactory.getEvents(function() {
            return;
          });
        }
      });
    };

    var ipObj1 = {
        callback: function(val) {
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
      };

    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(ipObj1);
    };

  });
