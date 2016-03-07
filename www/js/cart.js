angular.module('cart', ['ionic','menu'])
  .controller('CartCtrl', function($scope, Cart, $state) {

    // Get products in cart
    $scope.products = Cart.list();

    // Add item to cart
    $scope.addToCart = function(product) {
      Cart.add(product);
    };

    // Remove item from cart
    $scope.removeFromCart = function(product) {
      Cart.remove(product);
    };

    // Place order
    $scope.placeOrder = function() {
      console.log(Cart.order());
    };

    // Watch for changes in cart size
    $scope.$watch(
      function() {
        return Cart.size();
      },
      function(newVal) {
        $scope.productCount = newVal;
      }
    );

    // Watch for changes in product total
    $scope.$watch(
      function() {
        return Cart.total();
      },
      function(newVal) {
        $scope.total = newVal;
      }
    );
  })

  .factory('Cart', function($http) {
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
      remove: function(item) {
        var index = this.contains(item);
        if (index >= 0) {
          if (cart[index].qty > 1) {
            this.decreaseQty(index);
          } else {
            cart.splice(index,1);
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
      order: function() {
        // Set up http
        var data = {products: []};
        angular.forEach(cart, function(item) {
          data.products.push({id: item.id});
        });
        return data;
      },
    };
  });
