factories.factory('EventFactory', function($http, accessFactory, HOST, httpService) {

  var events;
  var oneEvent;

  var getEvents = function(done) {
    var url;
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/events';
    } else {
      url = '/data/events.json';
    }

    console.log('HÄR url' + url);

    httpService.get(url, function(err, res) {
      if (err) {
        console.log('error: ' + err);
        return done(err.error);
      }
      console.log('i factory, events: ' + res);
      events = res.result;
      return done(events);
    });
  };

  var getListOfEvents = function() {
    return events;
  };

  var setEvent = function(chosenEvent) {
    oneEvent = chosenEvent;
  };

  var getEvent = function() {
    return oneEvent;
  };

  return {
    getEvents: getEvents,
    getEvent: getEvent,
    setEvent: setEvent,
    getListOfEvents: getListOfEvents,
  };
});
