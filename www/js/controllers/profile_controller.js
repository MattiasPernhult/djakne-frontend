controllers.controller('ProfileController',
  function($scope, SessionFactory, ProfileFactory, $state) {

    // When user enters view, check settings
    $scope.$on('$ionicView.enter', function() {
      ProfileFactory.checkOrderSettings('Takeaway');
      ProfileFactory.checkOrderSettings('Lactose');

      // Get ordersettings
      $scope.orderSettings = ProfileFactory.getOrderSettings();
      console.log($scope.orderSettings);
    });
    ProfileFactory.getUser(function(data) {
      $scope.user = JSON.parse(data);
      console.log($scope.user);
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
  });

  $scope.addGhipy = function(text) {
    var text = $scope.text;
    ProfileFactory.addGhipy(text, function(err, result) {
    if (err) {
      toastService.showLongBottom(err.error);
    } else {
      $scope.userComment.text = null;
      ProfileFactory.addGhipy;
      $scope.show = true;
    }
  });
};
