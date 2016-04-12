factories.factory('MembersFactory', function($http, HOST, httpService) {
  var getMembers = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/member/today';
    } else {
      url = '/data/member_today.json';
    }

    httpService.get(url, function(err, result) {
      if (err) {
        return done({error: err}, null);
      }
      return done(null, result);
    });
  };

  return {
    getMembers: getMembers,
  };
});
