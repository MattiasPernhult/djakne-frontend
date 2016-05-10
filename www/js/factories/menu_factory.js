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
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/menu/categories?join=Cold%20drink,Christmas%20must,' +
      'Coffee,Special%20tea,Food,Breakfast,Cookies,Reztart,Coffee,Dropcoffee,Coffee,' +
      'Whole%20coffee%20beans,Sweets,Cookies';
    } else {
      url = '/data/menu_categories.json';
    }
    if (products) {
      return done(products);
    }

    httpService.get(url, function(err, result) {
      if (err) {
        return done(err);
      }
      products = result.data;
      return done(products);
    });
  };

  return {
    getProducts: getProducts,
    getFavourites: getFavourites,
  };
});
