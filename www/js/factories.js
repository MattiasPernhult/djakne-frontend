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

.factory('ProfileFactory', function() {
  var orderSettings = {
    Takeaway:
      {
        name: 'Takeaway',
        checked: 'false',
      },
    Lactos:
      {
        name: 'Lactos',
        checked: 'false',
      },
  };

  return {
    getOrderSettings: function() {
      return orderSettings;
    },
    checkOrderSettings: function(name) {
      if (window.localStorage[name]) {
        orderSettings[name].checked = true;
      }else {
        orderSettings[name].checked  = false;
      }
    },
  };
})

.factory('SessionFactory', function() {
  return {
    add: function(name,value) {
      window.localStorage.setItem(name,value);
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
  }
})
  .factory('RatingFactory', function($http, HOST) {
    var rating;
    var getRating = function(done) {
    var url = HOST.hostAdress + ':4000/coffee/current';

    if (rating) {
      return done(rating);
    }
    $http.get(url)
      .then(function(response) {
        // Handle Success
        console.log('success: ' + response);
        rating = response.data.result;
        return done(rating);
      }, function(response) {
        // Handle Failure
        console.log('ERROR' + response);
        return done(response.data.error);
      });
  };
    return {
    getRating: getRating,
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
    // if (products)  {
    //   return done(products);
    // }
    var url;
    // if (accessFactory.getAccessToken()) {
    //   url = HOST.hostAdress + ':3000/menu?token=' + accessFactory.getAccessToken();
    // } else {
    //    url = 'data/test.json';
    // }
    // url = 'data/test.json';
    url = HOST.hostAdress + ':4000/menu/categories';

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

.factory('Cart', function($http, accessFactory, HOST, $state, $ionicLoading, $location) {
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
    remove: function(item)  {
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
    order: function(message, takeaway, singleItem)  {
      var data = {
        message: message,
        takeaway: takeaway,
        products: [],
      };

      if (!singleItem) {
        angular.forEach(cart,function(obj) {
          for (var i = 0; i < obj.qty; i++) {
            data.products.push({id: obj.qty});
          }
        });
      } else {
        data.products.push({id: singleItem.id});
      }
      console.log(data);
      console.log("Köpet är gjort!");
      $http.post(HOST.hostAdress + ':3000/order?token=' + accessFactory.getAccessToken(), data)
      .success(function(res) {

        //alert('Din order är skickad!');
        cart.length = 0;
        $location.path('/tab/menu');
        //alert('success');
        //alert(JSON.stringify(res));
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
