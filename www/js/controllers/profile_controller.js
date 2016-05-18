controllers.controller('ProfileController',
function($scope, SessionFactory, ProfileFactory, EventFactory, $state, toastService) {
  $scope.userWish = {};
  $scope.addGiphy = function() {
    var text = $scope.userWish.text;
    ProfileFactory.addGiphy(text, function(err, result) {
      if (err) {
        toastService.showLongBottom(err.error);
      } else {
        $scope.userWish = result;
        toastService.showLongBottom('You giphy wish will become true in near future..');
      }
    });
  };

  ProfileFactory.getUser(function(data) {
    $scope.user = JSON.parse(data);
  });

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway', 'Takeaway');
    ProfileFactory.checkOrderSettings('Lactose', 'Lactose free');
    ProfileFactory.checkOrderSettings('CoffeeMenu', 'CoffeeMenu as startpage');

    $scope.orderSettings = ProfileFactory.getOrderSettings();
  });

  ProfileFactory.getWifi(function(data) {
    $scope.wifiMember = data.member;
    $scope.wifiPremium = data.premium;
    console.log($scope.wifi);
  });

  $scope.logout = function() {
    window.localStorage.token = undefined;
    window.localStorage.tokenExpires = undefined;
    $state.go('login');
  };

  // When user changes settings, add or remove localstorage
  $scope.change = function(name, value) {
    if (window.localStorage[name]) {
      SessionFactory.remove(name);
    } else {
      SessionFactory.add(name, value);
    }
  };

  EventFactory.getEvents(function(data) {
    var events = data;
    //  var id = 687;
    var id = $scope.user.id;
    $scope.isBooked = [];
    angular.forEach(events, function(event) {
      for (var i = 0; i < event.attendants.length; i++) {
        if (id === event.attendants[i].id) {
          $scope.isBooked.push(event);
          break;
        }
      }
    });
    $scope.bookedQty = $scope.isBooked.length;
    if ($scope.isBooked.length > 1) {
      var list = $scope.isBooked;
      $scope.isBooked = list.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a - b;
      });
    }
  });
});
