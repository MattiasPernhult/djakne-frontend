factories.factory('CoffeeFactory', function(HOST, httpService) {
  var coffee;

  var getCoffee = function(done) {
    var url = HOST.hostAdress + ':4000/coffee/current';

    if (coffee) {
      return done(coffee);
    }
    httpService.get(url, function(err, result) {
      if (err) {
        return done(err.error);
      }
      coffee = result.result;
      return done(coffee);
    });
  };

  return {
    getCoffee: getCoffee,
  };
});
