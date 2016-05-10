controllers.controller('AddEventController',
  function($scope, $state, $http, HOST, EventFactory, $cordovaToast,
  httpService, toastService, accessFactory) {
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
      var member = accessFactory.getMemberInfo();
      if ($scope.event.place && $scope.event.adress) {
        place = $scope.event.place + ', ' + $scope.event.adress;
      } else {
        place = 'Djäkne';
      }
      var formData = {
        title: $scope.event.title,
        text: $scope.event.text,
        author: String(member.id),
        date: $scope.event.date,
        location: place,
      };
      console.log('formData satt: ' + JSON.stringify(formData, null, 4));
      var url = HOST.hostAdress + ':4000/events';
      httpService.post(url, formData, function(err, result)  {
        if (err) {
          toastService.showLongBottom(err.error);
        } else {
          toastService.showLongBottom('Event was created');
          $scope.event = {};
          console.log('skapat event, resultat från api: ' + JSON.stringify(result, null, 4));
          EventFactory.addEventToList(result.data);
          $state.go('tab.home');
        }
      });
    };
  });
