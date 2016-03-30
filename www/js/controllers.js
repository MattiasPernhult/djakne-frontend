angular.module('controllers', ['factories', 'config', ])

.controller('RatingController', function($scope) {

  $scope.ratingsObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor: 'rgb(96, 96, 96)',
    rating: 2,
    minRating: 1,
    readOnly: true,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    },
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };

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
    console.log(Cart.order());
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
  EventFactory.getEvents(function(data) {
    console.log(data);
    $scope.events = data;
  });
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
})

.controller('EventDescriptionController', function($scope, EventFactory) {
  var eventData = EventFactory.getEvent();
  $scope.chosenEvent = eventData;

  $scope.$watch(function() {
      return EventFactory.getEvent();
    },
    function(newVal) {
      $scope.chosenEvent = newVal;
    }
  );
})

.controller('AddEventController', function($scope, $http) {

  $scope.event = {};

  $scope.sendPost = function() {
    console.log('scope: ' + $scope.event.title);

    var formData = {
      title: $scope.event.title,
      text: $scope.event.text,
      author: $scope.event.author,
      date: $scope.event.date,
    };

    var url = 'http://localhost:3000/events';
    console.log('i sendPost');
    console.log('formData : ' + formData.title);
    $http.post(url, formData)
      .success(function(data, status, headers, config) {
        console.log('Data: ' + data);
      })
      .error(function(err, status, headers, config) {
        console.log('ERROR: ' + err);
        console.log(JSON.stringify(err));
      });
  };
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
