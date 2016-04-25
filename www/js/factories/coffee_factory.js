factories.factory('CoffeeFactory', function(HOST, httpService, debugService) {
  var coffee;

  var getCoffee = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/coffee/current';
    } else {
      url = 'data/coffee_current.json';
    }

    if (coffee) {
      return done(coffee);
    }
    httpService.get(url, function(err, result)  {
      if (err) {
        if (debugService.isDebug()) {
          provideDefaultData(done);
        } else {
          return done(err.error, null);
        }
      }
      coffee = result.result;
      return done(null, coffee);
    });
  };

  var provideDefaultData = function(done)  {
    httpService.get('data/coffee_current.json', function(err, result) {
      return done(null, result.result);
    });
  };

  return {
    getCoffee: getCoffee,
  };
});
