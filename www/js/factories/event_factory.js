factories.factory('EventFactory', function($http, accessFactory, HOST, httpService) {

  var events;
  var oneEvent;

  var getEvents = function(done) {
    var url = HOST.hostAdress + ':4000/events';

    httpService.get(url, function(err, result) {
      if (err) {
        return done(err.error);
      }
      events = result.result;
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
