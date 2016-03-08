angular.module('menu', ['ionic', 'login', 'config'])
  .controller('MenuCtrl', function($scope, $state, MenuFactory, Cart, accessService) {
    console.log('MENU CONTROLLER');
    console.log(accessService.getAccessToken());
    // Rout to specific page
    $scope.go = $state.go.bind($state);

    // Controll if item is in cart
    $scope.inCart = function(product) {
      return Cart.contains(product);
    };

    // Watch for changes in cart size
    $scope.$watch(
      function() {
        return Cart.size();
      },
      function(newVal) {
        $scope.productTotal = newVal;
      }
    );

    // Get product menu
    MenuFactory.getProducts(function(data) {
      $scope.products = data;
    });

    // Add item to cart
    $scope.addToCart = function(product) {
      Cart.add(product);
    };

    // Remove item from cart
    $scope.removeFromCart = function(product)  {
      Cart.remove(product);
    };
  })

.factory('MenuFactory', function($http, accessService, HOST) {
  return {
    getProducts: function(done) {
      var url = HOST.hostAdress + ':3000/menu?token=' + accessService.getAccessToken();
      $http.get(url)
        .then(function(response) {
          // Handle Success
          return done(response.data.products);
        }, function(response) {
          // Handle Failure
          return done(response.data);
        });
    },
  };
});
