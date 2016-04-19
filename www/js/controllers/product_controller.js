controllers.controller('ProductController',
function($scope, $state, $http, HOST, accessFactory, Cart,
MenuFactory, $cordovaLocalNotification, $ionicPlatform, $ionicPopup, ProfileFactory,
notificationService, httpService, $ionicSideMenuDelegate, $ionicScrollDelegate) {

  $scope.toggleCart = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  if (window.cordova) {
    var push = PushNotification.init({
      android: {
        senderID: '104492237304',
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
      },
      windows: {},
    });

    push.on('notification', function(data) {
      var notification = {
        id: 1,
        title: 'Your order',
        text: data.message,
        data: {
          customProperty: 'custom value',
        },
      };
      notificationService.schedule(notification);
    });

    push.on('registration', function(data) {
      // TODO: Fix local storage of registration ID
      var url = HOST.hostAdress + ':3000/push/token/gcm?token=' + accessFactory.getAccessToken();
      var body = {
        token: data.registrationId,
      };
      httpService.post(url, body, function(err, result) {
        console.log(err);
        console.log(result);
      });
    });

    push.on('error', function(err) {
      console.log(err);
    });
  }

  $scope.customersProducts = Cart.list();
  $scope.userFavorites = $scope.userFavorites  || [];
  // $scope.specials = [{
  //     name: 'Laktosfritt',
  //     checked: false,
  //   }, {
  //     name: 'Takeaway',
  //     checked: false,
  //   },
  // ];

  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactose');
    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();
  });

  $scope.expand = function(vote) {
    vote.show = !vote.show;
  };

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

  MenuFactory.getProducts(function(data) {
    $scope.products = data;
  });

  $scope.addFavorite = function(item) {
    console.log(item);
    $scope.userFavorites.push(item);
    window.localStorage.setItem('favorites', JSON.stringify($scope.userFavorites));
  };

  $scope.removeFavorite = function(index) {
    $scope.userFavorites.splice(index, 1);
    window.localStorage.setItem('favorites', JSON.stringify($scope.userFavorites));
  };

  $scope.getFavorites = function() {
    var res;
    var favorites;
    res = window.localStorage.getItem('favorites');
    favorites = JSON.parse(res);
    return favorites;
  };

  $scope.isFavorite = function(item)  {
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

  $scope.addToCart = function(product) {
    Cart.add(product);
  };

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
    var comment = document.getElementById('comment').value;
    if ($scope.orderSettings.Lactose.checked) {
      message += 'Laktosfritt: Ja';
    }
    if ($scope.orderSettings.Takeaway.checked) {
      takeaway = true;
    }
    if (comment) {
      if (message) {
        message += '. ' + comment;
      } else {
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
    if (window.localStorage.Lactose) {
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
});
