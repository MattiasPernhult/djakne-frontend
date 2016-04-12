factories.factory('MenuFactory', function($http, accessFactory, HOST, httpService) {

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

    httpService.get(url, function(err, result) {
      if (err) {
        return done(result.data);
      }
      favourites = result.data.products;
      console.log(favourites);
      return done(favourites);
    });
  };

  var getProducts = function(done) {
    var url = HOST.hostAdress + ':4000/menu/categories';
    if (products) {
      return done(products);
    }

    httpService.get(url, function(err, result) {
      if (err) {
        return done(result.data);
      }
      products = result.data.products;
      return done(products);
    });
  };

  return {
    getProducts: getProducts,
    getFavourites: getFavourites,
  };
});
