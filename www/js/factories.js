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
      .then(function(response) {
        // Handle Success
        favourites = response.data.products;
        console.log(favourites);
        return done(favourites);
      }, function(response) {
        // Handle Failure
        return done(response.data);
      });
  };

  var getProducts = function(done) {
    if (products)  {
      return done(products);
    }
    var url;
    if (accessFactory.getAccessToken()) {
      url = HOST.hostAdress + ':3000/menu?token=' + accessFactory.getAccessToken();
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
    getFavourites: getFavourites,
  };
})

.factory('Cart', function($http, accessFactory, HOST, $state) {
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
    getProductsId: function() {
      var productsId = [];
      for (var index in cart) {
        var object = cart[index];
        productsId.push({id: object.id});
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
    order: function()  {
      var data = {
        'message': 'asdf',
        'takeaway': 1,
        'products':[{'id': 1}]
      };

      $http.post(HOST.hostAdress + ':3000/order?token=' + accessFactory.getAccessToken(), data)
      .success(function(res) {

        alert('Din order är skickad!');
        // $state.go('menu');
        alert('success');
        alert(JSON.stringify(res));
      })
      .error(function(err) {
        // alert('Something went wrong there, try again');
        alert('error');
        alert(JSON.stringify(err));
      });

      return data;
    },
  };
});
