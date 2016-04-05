angular.module('controllers', ['factories', 'config', ])

.controller('ProfileController', function($scope, SessionFactory, ProfileFactory, $state) {

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');

    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();

  });
  $scope.logout = function() {
    $state.go('login');
  };
  // When user changes settings, add or remove localstorage
  $scope.change = function(name, value) {

    if (window.localStorage[name]) {
      SessionFactory.remove(name);
    }else {
      SessionFactory.add(name,value);
    }
  };

})

.controller('HomeController', function($scope, RatingFactory) {
    RatingFactory.getRating(function(data) {
      console.log(data);
      $scope.rating = data;
    });
  })

.controller('ProductController', function($scope, $state, $http, HOST, accessFactory, Cart,
  MenuFactory, $cordovaLocalNotification, $ionicPlatform, $ionicPopup, ProfileFactory) {

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
    // alert(data.registrationId);
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
  //
  // push.on('notification', function(data) {
  //   console.log(JSON.stringify(data));
  //
  //   $cordovaLocalNotification.schedule({
  //     id: 1,
  //     title: 'Your order',
  //     text: data.message,
  //     data: {
  //       customProperty: 'custom value',
  //     },
  //   }).then(function(result) {
  //     // ...
  //   });


    // var alarmTime = new Date();
    // alarmTime.setMinutes(alarmTime.getSeconds() + 3);
    // $cordovaLocalNotification.add({
    //   date: alarmTime,
    //   message: data.message,
    //   title: 'Your order',
    //   autoCancel: true,
    //   sound: null,
    // }).then(function() {
    //   console.log('The notification has been set');
    // });
  // });
  //
  // push.on('error', function(err) {
  //   console.log(err);
  // });

  $scope.userFavorites = $scope.userFavorites || [];

  $scope.expand = function(vote) {
    vote.show = !vote.show;
  };

  // Get settings
  $scope.orderSettings = ProfileFactory.getOrderSettings();

  // When user enters view check status for ordersettings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');

    if (window.localStorage.favorites) {
      $scope.userFavorites = $scope.getFavorites();
    }
  });

  // $scope.go = $state.go.bind($state);
  $scope.customersProducts = Cart.list();

  // Watch for changes in cart size
  $scope.$watch(function() {
      return Cart.size();
    },
    function(newVal) {
      $scope.cartQty = newVal;
    }
  );

  $scope.$watch(function() {
    return Cart.getTotalPrice();
  }, function(newVal) {
    $scope.totalPrice = newVal;
  });

  $scope.inCart = function(product) {
    return Cart.contains(product);
  };

  // Get product menu
  MenuFactory.getProducts(function(data) {
    $scope.products = data;
  });

  // Add favorites -- New function!

  $scope.addFavorite = function(item) {
    console.log(item);
    $scope.userFavorites.push(item);
    window.localStorage.setItem('favorites',JSON.stringify($scope.userFavorites));
  };

  // New function - Remove favorite
  $scope.removeFavorite = function(index) {
    $scope.userFavorites.splice(index,1);
    window.localStorage.setItem('favorites',JSON.stringify($scope.userFavorites));
  };

  // Get favorites -- New function!
  $scope.getFavorites = function() {
    var res;
    var favorites;
    res = window.localStorage.getItem('favorites');
    favorites = JSON.parse(res);
    return favorites;
  };

  $scope.isFavorite = function(item) {
    var exists;
    for (var index = 0; index < $scope.userFavorites.length; index++) {
      if (item.id === $scope.userFavorites[index].id) {
        exists = true;
        item.isFavorite = false;
        $scope.removeFavorite(index);
        break;
      }
    }
    if (!exists) {
      item.isFavorite = true;
      $scope.addFavorite(item);
    }
  };


  $scope.isActive = function(item) {
   for (var index = 0; index < $scope.userFavorites.length; index++) {
     if (item.id === $scope.userFavorites[index].id) {
       item.isFavorite = true;
       break;
     }
   }
 };

  // Add item to cart
  $scope.addToCart = function(product) {
    Cart.add(product);
  };

  // Remove item from cart
  $scope.removeFromCart = function(product)  {
    Cart.remove(product);
  };

  $scope.goToMenu = function() {
    $state.go('tab.menu');
  };

  $scope.priceRequest = function() {
    var data = {
      products: Cart.getProductsId(),
    };
    data = JSON.stringify(data);
    Cart.priceRequest(data, function(err, resp) {
      if (err) {
        alert('ERROR');
      } else {
        $state.go('cart');
      }
    });
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
     if (res) {
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
  function($scope, $state, $http, $location, $rootScope, accessFactory,
    HOST, $ionicSlideBoxDelegate) {
    console.log(HOST.hostAdress);
    $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
    $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
    $scope.grantType = 'authorization_code';
    $scope.cliendId = '77fqlypcm1ourl';
    $scope.clientSecret = 'UVKqpbFQchFA8ku0';
    $scope.login = function() {

      // var ref = window.open($scope.urlStep1, '_self');
      var ref = cordova.ThemeableBrowser.open($scope.urlStep1, '_blank', {
        statusbar: {
          color: '#000',
        },
        toolbar: {
          height: 0,
          color: '#000',
        },
        title: {
          color: '#FFFFFF',
          showPageTitle: true,
          staticText: 'Login',
        },
        backButtonCanClose: true,

      }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
          console.error(e.message);
        }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
          console.log(e.message);
})


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

    $scope.gallery = [{
      url: 'img/coffeeData.jpeg',
      title: 'Stay Connected',
      desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
    }, {
      url: 'img/djakne.png',
      title: 'Enjoy great coffee',
      desc: 'Donec dapibus, magna quis tincidunt finibus, tellus odio porttitor nisi.',
    }, {
      url: 'img/business1.jpeg',
      title: 'Evolve and share',
      desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
    }, ];

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
