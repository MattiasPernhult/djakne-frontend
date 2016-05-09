factories.factory('Cart', function($http, accessFactory, HOST, $state, $ionicLoading, $location,
  $cordovaToast, httpService, toastService) {
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
      }else {
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
      console.log(index);
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
      // return cart.length;
      var size = 0;
      angular.forEach(cart, function(item) {
        size += item.qty;
      });

      return size;
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
      var url = HOST.hostAdress + ':3000/menu/pricerequest?token=' + accessFactory.getAccessToken();
      httpService.post(url, data, function(err, result) {
        if (err) {
          return done(err);
        }
        totalPrice = result.totalPrice;
        return done(null);
      });
    },
    getTotalPrice: function() {
      return totalPrice;
    },
    order: function(message, takeaway, singleItem, done) {
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
      var url = HOST.hostAdress + ':3000/order?token=' + accessFactory.getAccessToken();
      httpService.post(url, data, function(err, result)  {
        if (err) {
          toastService.showLongBottom('Problem with order!');
        } else {
          cart.length = 0;
          $location.path('/tab/menu');
          toastService.showLongBottom('Order was sent!');
        }
        done();
      });
    },
  };
});
