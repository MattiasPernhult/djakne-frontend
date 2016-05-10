factories.factory('ProfileFactory', function(HOST, $http, accessFactory, httpService) {
  var orderSettings = {
    Takeaway: {
      name: 'Takeaway',
      checked: 'false',
    },
    Lactose: {
      name: 'Lactose free',
      checked: 'false',
    },
    CoffeeMenu: {
      name: 'CoffeeMenu as startpage',
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

  var addGiphy = function(text, done) {
    var url;
    console.log('NOT OK!');
    var token = accessFactory.getAccessToken();
    var data = {
      token: token,
      giphy: text,
    };
    url = HOST.hostAdress + ':4000/retrotv/request ';
    console.log(url);
    console.log(data);
    httpService.post(url, data, function(err, result) {
      if (err) {
        console.log('NOT OK!');
      } else {
        console.log('Yiiipppiee!');
        console.log('res: ' + result);
      }
      done (err, result);
    });
  };

  return {
    addGiphy: addGiphy,
    getUser: getUser,
    getWifi: getWifi,
    getOrderSettings: getOrderSettings,
    checkOrderSettings: checkOrderSettings,
  };
});
