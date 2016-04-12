angular.module('controllers', ['factories', 'config', ])

.controller('ProfileController', function($scope, SessionFactory, ProfileFactory, $state) {

  // When user enters view, check settings
  $scope.$on('$ionicView.enter', function() {
    ProfileFactory.checkOrderSettings('Takeaway');
    ProfileFactory.checkOrderSettings('Lactos');


    // Get ordersettings
    $scope.orderSettings = ProfileFactory.getOrderSettings();
    console.log($scope.orderSettings);
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
    accessFactory, $ionicModal, MembersFactory, $cordovaToast) {

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
          $cordovaToast.showLongBottom('Ditt resultat har skickats').then(function(success) {
            // success
          }, function(error) {
            // error
          });
        })
        .error(function(err) {
          console.log(err);
          $cordovaToast.showLongBottom(err.result).then(function(success) {
            // success
          }, function(error) {
            // error
          });
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
  $scope.$on('$ionicView.enter', function() {
      ProfileFactory.checkOrderSettings('Takeaway');
      ProfileFactory.checkOrderSettings('Lactos');
      // Get ordersettings
      $scope.orderSettings = ProfileFactory.getOrderSettings();
      console.log($scope.orderSettings);
    });
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
  function($scope, $http, EventFactory, accessFactory, HOST, $cordovaToast) {
    var eventData = EventFactory.getEvent();
    $scope.chosenEvent = eventData;
    $scope.image = '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8KCwkMEQ8SEhEPERATFhwXExQaFRARGCEYGhwdHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABQAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD41oo6UVQBRRRQAUUUUAFFFFABRRQaAE70tFFABSgZOBSVLaEC6iJGRuHFJgtS5a6ReXAHlwyOzdFVck1WvrO4spjDcxPG46hhivavAk0VjpqSyWJKNHkTA5bPOB0/rXG/Emxu5IRqVysYDrvUqu3jcoHc5+9XHTxLlPlZ21MLy0uc8/ooortOIKDRQaAFwaSt250tJk3xYR8dOxrIngkhfa6EGsoVVLY1qUZQ3IaUHBBFLj2r0r4afCfVvFAt7+9L2Wly4IkAy7r7ensTWlzNK50fwy1dtU8OG2CJFNFOoOehwASR6c847Vz3xnvnS3sNKEm4pvLkdNuflX8M16/onw5tvBvnQIGnsJ3BjmlwSzY6H0OP5VXtPC1rqfjNheaZb3VikJ8zzIgwXOCCPToP1ryoNLEbaHrzcpYa1z5aor3r44/C/TLDRzrvhu0+z/Z8/aIEyVZepYDsRXgteqnc8hqwUUUUxHpVt4a11s/8STUuOT/or8fpU+j+GL7VdRGnWulSXl4xIWFYC8mR1GMZr6Y8LXuheH9Hj0mLXrS6jhhaNZHuELNlt3PNcf8ACSF7Hxr/AG7p8g3Wc7ByOcbgR/I185WxPs/e6XPqcPTdW6tqlc888N/Da9l8XWOlaz4enso3k/eedZlOACccgdcY/GvqHTdKt7azS2hhVERNoUDjA6Vznxh8UanHdaXqsEqi6jBiDlA3DPGDwRjoTVrQ/FF3dz21rNDE7T5AdfkK4BPToelduGxEWrX3PPxVKc3zWSsjJ8Y+OofC8stsdNvZ5E4XBRIyfTcxz+QNeXeJfi14hltN2l6ZpOnxyAsQzGd/xwFAP1Hatz41vLceL/7OeP8A1kccqMBnCEFST+KH8q5m30XSbF5TeQvdguDH1Hy57gdc8CumlU1aluYyw/NFOOxu/CXW9S8VaVqaa3cteOJgq74EiwrLyML1HHWvAviD4aGj67ftpwaXTUnIjf8AujPT6dga3viBqWsQXdm+nPeWJSFrd/spaMMqkDDbevfg1mQeKHns5LTVLVvnGDIEPP1FaOU0lKKOZRp3cJPXocRSdq1NV077JMrgFoX5Ujjj+lMsdI1K+t5LiztJZooc+YyjIXgnn8Aa151a9zDklzcttT0eysbqbiOKVz0+UE1raRpviq2lHkarPYsW+VYpmLnnjAU9a7rw5LaPfWz3ew2wYF0OFQL71BcXlvZ65dXOnwhY1ud8JjwqDoQQfr6V5f7m1qcXN/cj6H2tVytVkoL72c5eXur2+qW9prN3rU00jLk328BhuByA/PUCvXfh+/n6/CWBxDCzfQkY/qa4Hx34p1XxRDHHehHjt38yI4JZT3+Y8/kBXa/DS5VdXjVjkXdvgc8ZXn+WaVWm4VYcyS9DmjWjUpS5G3buZ3xmn1GLxvbTWkCPEllHuIUMc7pMqfQYI7fSuUtNfezP27UZ2aaFgzJtJBxwqj6Dnn0rsPiPqtpa+On068URebDG8E4wAvBBB/EcH6/hgeJY4rqwaP7NNOi53h2LHn0PbHHHPbGa6qVSPtHGa3ErqknBnANfXSGe70eS4eCed3IkjBIOcnOM+tVpNe1teJI4j/vwCt3wgJ7KGXEQkgS6cBDJ6YyDg4/GvQ9W8Y6FeaGLAeCLW2uFX5LiK5fdnuSD1+laSclJ8sml8jKFamoJSgm/ncj8N+CbvxF4Pt7rRtM1G51a41hrGJvPgS1ZFtzKUwzBxJhScn5MDGd3Fc38QPDXiHwno5l17R57L7VYvcW6zDiRQuSDg8MOMocMMjIGRXafDf4mjwdpVhYf2L9t+yaxJqe/7V5W/fatb+XjYcY3bs+2Md65Lxt4qTU/hto3hv8As5c6JDejeZt32nz33424G3GMdTnOeK+7niJ+8m48mvVbWfn6dOp+TUsLTvCSUvaXWlnvePl5y1v08z//2Q==';
    $scope.showImage = false;
    $scope.$watch(function() {
        return EventFactory.getEvent();
      },
      function(newVal) {
        $scope.chosenEvent = newVal;
      }
    );
    $scope.signUp = function() {
      var url = HOST.hostAdress + ':4000/events/register/' + $scope.chosenEvent._id;
      var body = {
        token: accessFactory.getAccessToken(),
      };
      // console.log('URL till signup: ' + url);
      // console.log('accessToken : ' + accessFactory.getAccessToken());
      console.log(url);
      $http.post(url, body)
        .success(function(data, status, headers, config) {
          console.log('SUCCESS data: ' + data);
          $scope.showImage = true;
          $cordovaToast.showLongBottom('Du är nu anmäld till eventet').then(function(success) {
            // success
          }, function(error) {
            // error
          });
        })
        .error(function(err, status, headers, config) {
          console.log('ERROR: ' + err);
          $cordovaToast.showLongBottom('Något blev fel så du är ej anmäld').then(function(success) {
            // success
          }, function(error) {
            // error
          });
        });
    };
  })

.controller('AddEventController', function($scope, $http, HOST, EventFactory, $cordovaToast) {

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
        $cordovaToast.showLongBottom('Eventet har skapats').then(function(success) {
          // success
        }, function(error) {
          // error
        });
        EventFactory.getEvents(function() {
          return;
        });
      })
      .error(function(err, status, headers, config) {
        console.log('ERROR: ' + err);
        $cordovaToast.showLongBottom(err.message).then(function(success) {
          // success
        }, function(error) {
          // error
        });
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
