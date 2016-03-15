angular.module('controllers', ['factories', 'config'])

.controller('RatingController', function($scope) {
  $scope.ratingFull = {};
  $scope.ratingFull.rate = 3;
  $scope.ratingFull.max = 5;
})

.controller('ProductController', function($scope, $state, Cart, MenuFactory) {

  $scope.go = $state.go.bind($state);
  $scope.customersProducts = Cart.list();

  // Watch for changes in cart size
  $scope.$watch(function() {
      return Cart.size();
    },
    function(newVal) {
      $scope.cartQty = newVal;
    }
  );

  $scope.inCart = function(product) {
    return Cart.contains(product);
  };

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

  // Place order
  $scope.placeOrder = function() {
    Cart.order();
  };

  // Watch for changes in product total
  $scope.$watch(function() {
      return Cart.total();
    },
    function(newVal) {
      $scope.total = newVal;
    }
  );
})

.controller('LoginController',
  function($scope, $http, $location, $rootScope, accessFactory, HOST) {
    console.log(HOST.hostAdress);
    $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
    $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
    $scope.grantType = 'authorization_code';
    $scope.cliendId = '77fqlypcm1ourl';
    $scope.clientSecret = 'UVKqpbFQchFA8ku0';
    $scope.login = function() {

      var ref = window.open($scope.urlStep1, '_self');

      ref.addEventListener('loadstop', function(event) {
        if ((event.url).startsWith($scope.redirectUri)) {
          ref.executeScript({
              code: 'document.body.innerHTML',
            },
            function(values) {
              var body = values[0];
              var token = body.substring(body.indexOf('{') + 10, body.lastIndexOf('}') - 1);
              accessFactory.changeAccessToken(token);
              ref.close();
              $rootScope.$apply(function() {
                $location.path('/tab/home');
              });
            }
          );
        }
      });
    };
  });
