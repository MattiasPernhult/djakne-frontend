angular.module('menu', ['ionic'])
  .controller('MenuCtrl', function($scope, MenuFactory) {
    $scope.products = MenuFactory.getProducts();
  })

  .factory('MenuFactory', function($http) {
    // Example products
    var products = [
      {
        id: 1,
        name: 'Stor Kaffe',
        price: 22,
      }, {
        id: 2,
        name: 'Kanelbulle',
        price: 24,
      }, {
        id: 3,
        name: 'Semla',
        price: 33,
      }, {
        id: 4,
        name: 'Espresso',
        price: 20,
      }, {
        id: 5,
        name: 'Baguette',
        price: 35,
      }, {
        id: 6,
        name: 'Macchiato',
        price: 30,
      },
    ];

    return {
      // Test Request
      getProducts: function() {
        return products;
      },
      // Http Request
      listProducts: function() {
        $http.get(urlBase + '/menu')
          .then(function(response) {
            // Handle Success
            console.log(response.data);
          }, function(response) {
            // Handle Failure
            console.log(response);
          });
      },
    };
  });
