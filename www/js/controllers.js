angular.module('controllers', ['factories', 'config', ])

.controller('HomeController', function($scope, RatingFactory) {
  RatingFactory.getRating(function(data) {
    console.log(data);
    $scope.rating = data;
  });
})
   // logout Hassan
.controller('logoutController', function($scope, $state) {
  $scope.logout = function() {
    $state.go('login');
  };
})

.controller('ProductController', function($scope, $state, $http, HOST, accessFactory, Cart,
  MenuFactory, $cordovaLocalNotification) {
  var push = PushNotification.init({
    android: {
      senderID: '104492237304',
    },
    ios: {
      alert: 'true',
      badge: 'true',
      sound: 'true',
    },
    windows: {},
  });

  push.on('registration', function(data) {
    if (!window.localStorage.registrationId) {
      window.localStorage.registrationId = data.registrationId;
      var body = {
        token: data.registrationId,
      };
      var url = HOST.hostAdress + ':3000/push/token/gcm?token=' + accessFactory.getAccessToken();
      $http.post(url, body)
        .success(function(res) {
          console.log(res);
        })
        .error(function(err) {
          console.log(err);
        });
    }
  });

  push.on('notification', function(data) {
    console.log(JSON.stringify(data));
    var alarmTime = new Date();
    alarmTime.setMinutes(alarmTime.getSeconds() + 3);
    $cordovaLocalNotification.add({
      date: alarmTime,
      message: data.message,
      title: 'Your order',
      autoCancel: true,
      sound: null,
    }).then(function() {
      console.log('The notification has been set');
    });
  });

  push.on('error', function(err) {
    console.log(err);
  });

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
  function($scope, $state, $http, $location, $rootScope, accessFactory, HOST, $ionicSlideBoxDelegate) {
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
              $state.go('tab.home');
            });
        }
      });
    };

    $scope.gallery = [
      {
        url: 'img/coffeeData.jpeg',
        title: 'Stay Connected',
        desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
      },
      {
        url: 'img/djakne.png',
        title: 'Enjoy great coffee',
        desc: 'Donec dapibus, magna quis tincidunt finibus, tellus odio porttitor nisi.',
      },
      {
        url: 'img/business1.jpeg',
        title: 'Evolve and share',
        desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
      },
    ];

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  });
