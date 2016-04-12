controllers.controller('logoutController', function($scope, $state) {
  $scope.logout = function() {
    $state.go('login');
  };
});
