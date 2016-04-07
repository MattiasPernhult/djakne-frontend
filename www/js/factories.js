angular.module('factories', ['config'])


.factory('accessFactory', function() {
  var accessToken;

  var changeAccessToken = function(token)  {
    accessToken = token;
  };

  var getAccessToken = function() {
    return accessToken;
  };

  return {
    changeAccessToken: changeAccessToken,
    getAccessToken: getAccessToken,
  };
})

.factory('ProfileFactory', function(HOST, $http, accessFactory) {
  var url;
  var orderSettings = {
   Takeaway: {
     name: 'Takeaway',
     checked: 'false',
   },
   Lactos: {
     name: 'Lactos',
     checked: 'false',
   },
 };
  var getOrderSettings = function() {
    console.log(orderSettings);
    return orderSettings;
  };

  var checkOrderSettings = function(name) {
   if (window.localStorage[name]) {
     orderSettings[name].checked = true;
   } else {
     orderSettings[name].checked = false;
   }
 };

  var getUser = function(done) {
   url = HOST.hostAdress + ':3000/member?token=' + accessFactory.getAccessToken();
   $http.get(url)
   .success(function(response) {
     var userInfo = JSON.stringify(response.member);
     return done(userInfo);
   })
   .error(function(err) {
     console.log(err);
   });
 };

  return {
   getUser: getUser,
   getOrderSettings: getOrderSettings,
   checkOrderSettings: checkOrderSettings,
 };
})

.factory('SessionFactory', function()  {
  return {
    add: function(name, value) {
      window.localStorage.setItem(name, value);
    },
    remove: function(name) {
      window.localStorage.removeItem(name);
    },
    exists: function(name) {
      if (window.localStorage[name]) {
        return true;
      }
      return false;
    },
  };
})

.factory('CoffeeFactory', function(HOST, $http) {

  var coffee;

  var getCoffee = function(done) {
    var url = HOST.hostAdress + ':4000/coffee/current';

    if (coffee) {
      return done(coffee);
    }

    $http.get(url)
      .success(function(response) {
        // Handle Success
        console.log('success: ' + response);
        coffee = response.result;
        return done(coffee);
      }).error(function(err) {
        // Handle Failure
        console.log('ERROR' + err);
        return done(err.error);
      });
  };

  return {
    getCoffee: getCoffee,
  };
})

.factory('MembersFactory', function($http, HOST) {
  var getMembers = function(done) {
    var url = HOST.hostAdress + ':4000/member/today';
    $http.get(url)
      .success(function(result) {
        done(null, result);
      })
      .error(function(err) {
        done({
          error: err,
        }, null);
      });
  };

  return {
    getMembers: getMembers,
  };
})

.factory('EventFactory', function($http, accessFactory, HOST) {

  var events;
  var oneEvent;

  var getEvents = function(done) {
    var url = HOST.hostAdress + ':4000/events';

    $http.get(url)
      .success(function(res) {
        console.log('success: ' + res);
        console.log(JSON.stringify(res));
        events = res.result;
        return done(events);
      })
      .error(function(err) {
        console.log('ERROR' + err);
        return done(err.error);
      });
  };

  var getListOfEvents = function() {
    return events;
  };

  var setEvent = function(chosenEvent) {
    oneEvent = chosenEvent;
    console.log('nytt event satt: ' + oneEvent.title);
  };

  var getEvent = function() {
    return oneEvent;
  };

  return {
    getEvents: getEvents,
    getEvent: getEvent,
    setEvent: setEvent,
    getListOfEvents: getListOfEvents,
  };
})

.factory('MenuFactory', function($http, accessFactory, HOST) {

  var products;
  var favourites;

  var getFavourites = function(done) {
    if (favourites)  {
      return done(favourites);
    }
    var url;
    if (accessFactory.getAccessToken()) {
      url = HOST.hostAdress + ':3000/menu/favourites?token=' + accessFactory.getAccessToken();
    }

    $http.get(url)
      .success(function(response) {
        // Handle Success
        favourites = response.data.products;
        console.log(favourites);
        return done(favourites);
      }).error(function(response) {
        // Handle Failure
        return done(response.data);
      });
  };

  var getProducts = function(done) {
    var url = HOST.hostAdress + ':4000/menu/categories';

    $http.get(url)
      .then(function(response) {
        // Handle Success
        products = response.data.products;
        // products = response.data;
        console.log(products);
        return done(products);
      }, function(response) {
        // Handle Failure
        console.log(response);
        return done(response.data);
      });
  };

  return {
    getProducts: getProducts,
    getFavourites: getFavourites,
  };
})

.factory('Cart', function($http, accessFactory, HOST, $state, $ionicLoading, $location,
  $cordovaToast) {
  // Cart array
  var cart = [];
  var totalPrice = 0;
  return {
    list: function() {
      return cart;
    },
    add: function(item) {
      var index = this.contains(item);
      if (index < 0) {
        cart.push({
          qty: 1,
          id: item.id,
          name: item.name,
          price: item.price,
        });
      } else {
        this.increaseQty(index);
      }
    },
    remove: function(item) {
      var index = this.contains(item);
      if (index >= 0) {
        if (cart[index].qty > 1) {
          this.decreaseQty(index);
        } else {
          cart.splice(index, 1);
        }
      }
    },
    increaseQty: function(index) {
      cart[index].qty += 1;
    },
    decreaseQty: function(index) {
      cart[index].qty -= 1;
    },
    contains: function(product) {
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
          return i;
        }
      }
      return -1;
    },
    size: function() {
      return cart.length;
    },
    total: function() {
      var total = 0;
      angular.forEach(cart, function(item) {
        total += item.qty * item.price;
      });
      return total;
    },
    getProductsId: function() {
      var productsId = [];
      for (var index in cart) {
        var object = cart[index];
        productsId.push({
          id: object.id,
        });
      }
      return productsId;
    },
    priceRequest: function(data, done) {
      $http.post(HOST.hostAdress + ':3000/menu/pricerequest?token=' +
          accessFactory.getAccessToken(), data)
        .success(function(res) {
          totalPrice = res.totalPrice;
          return done(null);
        })
        .error(function(err) {
          return done(err);
        });
    },
    getTotalPrice: function() {
      return totalPrice;
    },
    order: function(message, takeaway, singleItem) {
      var data = {
        message: message,
        takeaway: takeaway,
        products: [],
      };

      if (!singleItem) {
        angular.forEach(cart, function(obj) {
          for (var i = 0; i < obj.qty; i++) {
            data.products.push({
              id: obj.qty,
            });
          }
        });
      } else {
        data.products.push({
          id: singleItem.id,
        });
      }
      console.log(data);
      console.log('Köpet är gjort!');
      $http.post(HOST.hostAdress + ':3000/order?token=' + accessFactory.getAccessToken(), data)
        .success(function(res) {
          cart.length = 0;
          $location.path('/tab/menu');
          $cordovaToast.showLongBottom('Din order har lagts').then(function(success) {
            // success
          }, function(error) {
            // error
          });
          // alert('success');
          // alert(JSON.stringify(res));
        }).error(function(err) {
          // alert('Something went wrong there, try again');
          // alert('error');
          // alert(JSON.stringify(err));
          console.log(err);
          $cordovaToast.showLongBottom('Problem med order').then(function(success) {
            // success
          }, function(error) {
            // error
          });
        });
    },
  };
});
