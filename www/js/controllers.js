angular.module('controllers', ['factories', 'config', ])

.controller('ProfileController', function($scope, SessionFactory, ProfileFactory, $state) {

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');


    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();

  });
  ProfileFactory.getUser(function(data) {
    $scope.user = JSON.parse(data);
    console.log($scope.user);
  });

  $scope.logout = function() {
    $state.go('login');
  };
  // When user changes settings, add or remove localstorage
  $scope.change = function(name, value) {

    if (window.localStorage[name]) {
      SessionFactory.remove(name);
    } else {
      SessionFactory.add(name, value);
    }
  };

})

.controller('HomeController', function($scope, CoffeeFactory, $http, HOST,
    accessFactory, $ionicModal, MembersFactory) {

    CoffeeFactory.getCoffee(function(data) {
      console.log(data);
      $scope.rating = data;
    });
    $scope.votes = 2;

    $scope.ratingsObject = {
      iconOn: 'ion-ios-star',
      iconOff: 'ion-ios-star-outline',
      iconOnColor: 'rgb(0, 0, 0)',
      iconOffColor: 'rgb(100, 100, 100)',
      rating: $scope.votes,
      minRating: 1,
      callback: function(rating) {
        $scope.ratingsCallback(rating);
      },
    };

    $scope.ratingsCallback = function(rating) {
      console.log('Selected rating is : ', rating);
      $scope.votes = rating;
    };

    $scope.body = {};

    $scope.send = function() {

      var rating = {
        vote: String($scope.votes),
        token: accessFactory.getAccessToken(),
      };

      console.log(rating);
      var url = HOST.hostAdress + ':4000/coffee/vote';
      $http.put(url, rating)
        .success(function(res) {
          console.log(res);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal)  {
      $scope.modal = modal;
    });

    $scope.openModal = function(member) {
      $scope.member = member;
      console.log($scope.member);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.gotoLinkedIn = function() {
      var ref = window.open($scope.member.linkedInProfile, '_system');
    };

    MembersFactory.getMembers(function(err, data)  {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        // $scope.members = [];
        // for (var i = 0; i < data.members.length; i += 2) {
        //   $scope.members.push(data.members.slice(i, i + 2));
        // }
        $scope.members = data.members;
      }
    });
  })
  // logout Hassan
  .controller('logoutController', function($scope, $state) {
    $scope.logout = function() {
      $state.go('login');
    };
  })

.controller('ProductController', function($scope, $state, $http, HOST, accessFactory, Cart,
  MenuFactory, $cordovaLocalNotification, $ionicPlatform, $ionicPopup, ProfileFactory) {

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
    console.log(JSON.stringify(data));

    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Your order',
      text: data.message,
      data: {
        customProperty: 'custom value',
      },
    }).then(function(result) {
      // ...
    });
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

  push.on('error', function(err) {
    console.log(err);
  });

  $scope.userFavorites = $scope.userFavorites  || [];

  $scope.expand = function(vote) {
    vote.show = !vote.show;
  };

  $scope.specials = [{
      name: 'Laktosfritt',
      checked: false,
    }, {
      name: 'Takeaway',
      checked: false,
    },

  ];

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
    window.localStorage.setItem('favorites', JSON.stringify($scope.userFavorites));
  };

  // New function - Remove favorite
  $scope.removeFavorite = function(index) {
    $scope.userFavorites.splice(index, 1);
    window.localStorage.setItem('favorites', JSON.stringify($scope.userFavorites));
  };

  // Get favorites -- New function!
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
    var comment = document.getElementById('comment').value;

    if ($scope.orderSettings.Lactos.checked) {
      message += 'Laktosfritt: Ja';
    }
    if ($scope.orderSettings.Takeaway.checked) {
      takeaway = true;
    }
    if (comment) {
      if (message) {
        message += '\n ' + comment;
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

.controller('EventController', function($scope, EventFactory, $state) {

  $scope.isVisible = false;
  $scope.toggleElement = function() {

    if ($scope.isVisible === false) {
      $scope.isVisible = true;
    } else {
      $scope.isVisible = false;
    }
  };

  EventFactory.getEvents(function(data) {
    console.log(data);
    $scope.events = data;
  });
  $scope.$watch(function() {
      return EventFactory.getListOfEvents();
    },
    function(newVal) {
      $scope.events = newVal;
    }
  );
  $scope.setEvent = function(chosenEvent) {
    EventFactory.setEvent(chosenEvent);
  };
  $scope.gotoeventMain = function() {
    $state.go('eventMain');
  };
  $scope.gotoBoard = function() {
    $state.go('boardMain');
  };
  $scope.gotoNews = function() {
    $state.go('newsMain');
  };
  $scope.gotoMembership = function() {
    $state.go('memberships');
  };

})

.controller('EventDescriptionController',
  function($scope, $http, EventFactory, accessFactory, HOST) {
    var eventData = EventFactory.getEvent();
    $scope.chosenEvent = eventData;

    $scope.$watch(function() {
        return EventFactory.getEvent();
      },
      function(newVal) {
        $scope.chosenEvent = newVal;
      }
    );
    $scope.signUp = function() {
      var url = HOST.hostAdress + ':4000/events/register' + '/' + $scope.chosenEvent._id +
      '?token=' + accessFactory.getAccessToken();
      console.log('URL till signup: ' + url);
      console.log('accessToken : ' + accessFactory.getAccessToken());
      $http.post(url, {})
        .success(function(data, status, headers, config) {
          console.log('SUCCESS data: ' + data);
        })
        .error(function(err, status, headers, config) {
          console.log('ERROR: ' + err);
        });
    };
  })

.controller('AddEventController', function($scope, $http, HOST, EventFactory) {

  $scope.event = {};

  $scope.sendPost = function() {
    console.log('scope: ' + $scope.event.title);

    var formData = {
      title: $scope.event.title,
      text: $scope.event.text,
      author: $scope.event.author,
      date: $scope.event.date,
    };

    var url = HOST.hostAdress + ':4000/events';
    console.log('i sendPost');
    console.log('formData : ' + formData.title);
    $http.post(url, formData)
      .success(function(data, status, headers, config) {
        console.log('Data: ' + data);
        EventFactory.getEvents(function() {
          return;
        });
      })
      .error(function(err, status, headers, config) {
        console.log('ERROR: ' + err);
        console.log(JSON.stringify(err));
      });
  };
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

      }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
        console.error(e.message);
      }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
        console.log(e.message);
      });


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
