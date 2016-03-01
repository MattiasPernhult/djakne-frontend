angular.module('menu', ['ionic'])
  .controller('MenuCtrl', function($scope, MenuFactory) {
    MenuFactory.getProducts(function(data) {
      $scope.products = data;
    });
  })

  .factory('MenuFactory', function($http) {

    return {
      // Http Request
      getProducts: function(done) {
        $http.get('data/menu.json')
          .then(function(response) {
            // Handle Success
            return done(response.data.products);
          }, function(response) {
            // Handle Failure
            console.log(response.data);
          });
      },
    };
  });
