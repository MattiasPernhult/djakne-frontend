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

.factory('EventFactory', function($http, accessFactory, HOST) {

  var events;
  var oneEvent;

  var getEvents = function(done) {
    var url = HOST.hostAdress + ':4000/events';

    if (events) {
      return done(events);
    }
    $http.get(url)
      .then(function(response) {
        // Handle Success
        console.log('success: ' + response);
        events = response.data.result;
        return done(events);
      }, function(response) {
        // Handle Failure
        console.log('ERROR' + response);
        return done(response.data.error);
      });
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
  };
})


.factory('MenuFactory', function($http, accessFactory, HOST) {

  var products;

  var getProducts = function(done) {
    if (products)  {
      return done(products);
    }
    var url;
    if (accessFactory.getAccessToken()) {
      url = HOST.hostAdress + ':4000/menu?token=' + accessFactory.getAccessToken();
    } else {
      url = 'data/menu.json';
    }
    $http.get(url)
      .then(function(response) {
        // Handle Success
        products = response.data.products;
        return done(products);
      }, function(response) {
        // Handle Failure
        return done(response.data);
      });
  };
  return {
    getProducts: getProducts,
  };
})

.factory('Cart', function($http) {
  // Cart array
  var cart = [];

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
    remove: function(item)  {
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
    order: function()  {
      // Set up http
      var data = {
        products: [],
      };
      angular.forEach(cart, function(item) {
        for (var i = 0; i < item.qty; i++) {
          data.products.push({
            id: item.id,
          });
        }
      });
      return data;
    },
  };
});
