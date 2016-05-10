factories.factory('NewsFactory', function(HOST, httpService, debugService) {
  var news;

  var getNews = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/issues';
    } else {
      url = 'data/news.json';
    }

    if (news) {
      return done(news);
    }
    httpService.get(url, function(err, result)  {
      if (err) {
        if (debugService.isDebug()) {
          provideDefaultData(done);
        } else {
          return done(err.error, null);
        }
      }
      news = result;
      return done(null, news);
    });
  };

  var provideDefaultData = function(done)  {
    httpService.get('data/news.json', function(err, result) {
      return done(null, result);
    });
  };

  return {
    getNews: getNews,
  };
});
