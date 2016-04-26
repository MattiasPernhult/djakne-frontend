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
      url = HOST.hostAdress + ':4000/menu/categories?join=Kall%20dryck,Julmust,Kaffe,Specialte,' +
      'Mat,Frukost,Kakor,Reztart,Kaffe,Droppkaffe,Kaffe,Hela%20b%C3%B6nor';
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
      products = result.products;
      return done(products);
    });
  };

  return {
    getProducts: getProducts,
    getFavourites: getFavourites,
  };
});
