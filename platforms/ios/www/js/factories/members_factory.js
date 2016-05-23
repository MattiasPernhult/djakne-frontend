factories.factory('MembersFactory', function($http, HOST, httpService, debugService) {
  var getMembers = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/member/today';
    } else {
      url = 'data/member_today.json';
    }

    httpService.get(url, function(err, result) {
      if (err) {
        if (debugService.isDebug()) {
          provideDefaultData(done);
        } else {
          return done({error: err}, null);
        }
      }
      if (debugService.isDebug()) {
        if (result.data.length === 0) {
          provideDefaultData(done);
        } else {
          return done(null, result.data);
        }
      }
    });
  };

  var provideDefaultData = function(done)  {
    httpService.get('data/member_today.json', function(err, result) {
      return done(null, result);
    });
  };

  return {
    getMembers: getMembers,
  };
});
