controllers.controller('ProfileController',
function($scope, SessionFactory, ProfileFactory, $state) {

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');

    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();
    console.log($scope.orderSettings);
  });
  ProfileFactory.getUser(function(data) {
    $scope.user = JSON.parse(data);
    console.log($scope.user);
  });

  $scope.logout = function() {
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
