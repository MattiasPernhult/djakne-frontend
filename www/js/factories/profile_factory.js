factories.factory('ProfileFactory', function(HOST, $http, accessFactory, httpService) {
  var orderSettings = {
    Takeaway: {
      name: 'Takeaway',
      checked: 'false',
    },
    Lactose: {
      name: 'Lactose',
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
  var getWifi = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/wifi?token=' + accessFactory.getAccessToken();
    } else {
      url = 'data/wifi.json';
    }
    httpService.get(url, function(err, result)  {
      if (!err) {
        return done(result);
      }
    });
  };

  return {
    getUser: getUser,
    getWifi: getWifi,
    getOrderSettings: getOrderSettings,
    checkOrderSettings: checkOrderSettings,
  };
});
