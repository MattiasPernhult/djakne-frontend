angular.module('controllers', ['factories', 'config', ])

.controller('ProfileController', function($scope, SessionFactory, ProfileFactory) {

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');

    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();

  });

  // When user changes settings, add or remove localstorage
  $scope.change = function(name, value) {

    if (window.localStorage[name]) {
      SessionFactory.remove(name);
    }else {
      SessionFactory.add(name,value);
    }
  };

})

.controller('ProductController', function($scope, $state, $http, HOST, accessFactory, Cart,
  MenuFactory, $cordovaLocalNotification, ProfileFactory, $ionicPopup) {


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




    $scope.favorites = [
      {
        title: 'Favoriter',
        icon: 'ion-android-favorite',
        products:
          [
            {
              id:1,
              name: 'Moocha',
              price: 20,
            },
            {
              id:2,
              name: 'Cappucino',
              price: 20,
            },
          ],
        },
    ];

  // END HERE

  $scope.items = [
      {
        title: 'Varma Drycker',
        icon: 'ion-coffee',
        products:
          [
            {
              id:1,
              name: 'Stor Kaffe',
              price: 20,
            },
            {
              id:2,
              name: 'Cappucino',
              price: 20,
            },
            {
              id:3,
              name: 'Black',
              price: 10,
            },
            {
              id:4,
              name: 'Large',
              price: 14,
            },
            {
              id:5,
              name: 'Cordova',
              price: 18,
            },
          ],
      },
      {
        title: 'Ätbart',
        icon: 'ion-android-restaurant',
        products:
          [
            {
              id:6,
              name: 'Pasta',
              price: 20,
            },
            {
              id:7,
              name: 'Smörgås',
              price: 22,
            },
            {
              id:8,
              name: 'Tårta',
              price: 20,
            },
            {
              id:9,
              name: 'Kakor',
              price: 22,
            },
            {
              id:10,
              name: 'Frukt',
              price: 20,
            },
          ],
      },
      {
        title: 'Övrigt',
        icon: 'ion-icecream',
        products:
          [
            {
              id:11,
              name: 'Julmust',
              price: 10,
            },
            {
              id:12,
              name: 'Cider',
              price: 15,
            },
            {
              id:13,
              name: 'Öl',
              price: 22,
            },
            {
              id:14,
              name: 'Läsk',
              price: 20,
            },
            {
              id:15,
              name: 'Saft',
              price: 19,
            },
          ],
      },
  ];

  $scope.expand = function(vote) {
     vote.show = !vote.show;
  };


  // Get settings
  $scope.orderSettings = ProfileFactory.getOrderSettings();

  // When user enters view check status for ordersettings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');
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

  MenuFactory.getFavourites(function(data) {
    $scope.favourites = data;
  });

  // Add item to cart
  $scope.addToCart = function(product) {
    Cart.add(product);
  };

  // Remove item from cart
  $scope.removeFromCart = function(product)  {
    Cart.remove(product);
  };

  $scope.priceRequest = function() {
    Cart.priceRequest();
  };


  // Place order
  $scope.placeOrder = function() {
    var singleItem = false;
    var message = '';
    var takeaway = false;
    var comment = document.getElementById("comment").value;

    if ($scope.orderSettings.Lactos.checked) {
      message += 'Laktosfritt: Ja';
    }
    if ($scope.orderSettings.Takeaway.checked) {
      takeaway = true;
    }
    if (comment) {
      if (message) {
        message += '\n ' + comment;
      }else {
        message += comment;
      }
    }

    Cart.order(message, takeaway, singleItem);
  };

  $scope.buyNow = function(item) {
    var takeaway = false;
    var message = '';
    item.qty = 1;


    if (window.localStorage.Takeaway) {
      takeaway = true;
    }
    if (window.localStorage.Lactos) {
      message += 'Laktosfritt: Ja';
    }

    Cart.order(message, takeaway, item);

  };

  $scope.showConfirm = function(item) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Lägga beställning?',
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log(item);
       $scope.buyNow(item);
     } else {
       console.log('Snabbeställning avbruten');
     }
   });
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
  function($scope, $http, $location, $rootScope, accessFactory, HOST, $ionicSlideBoxDelegate) {
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
