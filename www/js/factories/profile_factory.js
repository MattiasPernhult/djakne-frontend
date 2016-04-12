factories.factory('ProfileFactory', function(HOST, $http, accessFactory, httpService) {
  var orderSettings = {
    Takeaway: {
      name: 'Takeaway',
      checked: 'false',
    },
    Lactos: {
      name: 'Lactos',
      checked: 'false',
    },
  };
  var getOrderSettings = function() {
    console.log(orderSettings);
    return orderSettings;
  };

  var checkOrderSettings = function(name) {
    if (window.localStorage[name]) {
      orderSettings[name].checked = true;
    } else {
      orderSettings[name].checked = false;
    }
  };

  var getUser = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':3000/member?token=' + accessFactory.getAccessToken();
    } else {
      url = '/data/member.json';
    }
    httpService.get(url, function(err, result)  {
      if (!err) {
        var userInfo = JSON.stringify(result.member);
        return done(userInfo);
      }
    });
  };

  return {
    getUser: getUser,
    getOrderSettings: getOrderSettings,
    checkOrderSettings: checkOrderSettings,
  };
});
