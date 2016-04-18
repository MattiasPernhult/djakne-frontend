controllers.controller('AddEventController',
  function($scope, $http, HOST, EventFactory, $cordovaToast, httpService,
    toastService, ionicDatePicker) {

    $scope.event = {};

    $scope.sendPost = function() {
      console.log('scope.date : ' + $scope.event.date);
      var newDate = new Date($scope.event.date);
      var newTime = new Date($scope.event.time);
      console.log(newDate);
      var correctDate = newDate.getFullYear() + '-' + (newDate.getUTCMonth() + 1) + '-'
      + (newDate.getUTCDate() + 1) + 'T' + newTime.getHours() + ':' + newTime.getMinutes();

      console.log('correctDate :' + correctDate);

      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: $scope.event.author,
        date: correctDate,
      };
      console.log('time: ' + $scope.event.time);
      console.log('date : ' + formData.date);

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
          console.log(val);
          $scope.event.date = val;
          console.log('Return value from the datepicker popup is : ' + val);
        },
      };

    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(ipObj1);
    };

  });
