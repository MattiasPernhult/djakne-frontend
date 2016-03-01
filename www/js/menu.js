angular.module('menu', ['ionic'])
  .controller('MenuCtrl', function($scope, MenuFactory) {
    console.log(MenuFactory.getProducts());
    $scope.products = MenuFactory.getProducts();
  })

  .factory('MenuFactory', function($http) {

    return {
      // Http Request
      getProducts: function() {
        $http.get('data/menu.json')
          .then(function(response) {
            // Handle Success
            console.log(response.data);
          }, function(response) {
            // Handle Failure
            console.log(response.data);
          });
      },
    };
  });
