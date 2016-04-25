factories.factory('EventFactory', function($http, accessFactory, HOST, httpService) {

  var events;
  var oneEvent;

  var getEvents = function(done) {
    var url;
    var date = new Date().toISOString();
    if (window.cordova) {
      url = HOST.hostAdress + ':4000/events?dateFrom=' + date;
    } else {
      url = '/data/events.json';
    }

    httpService.get(url, function(err, res) {
      if (err) {
        console.log('error: ' + err);
        return done(err.error);
      }
      events = res.result;
      return done(events);
    });
  };

  var getListOfEvents = function() {
    return events;
  };

  var updateEventList = function(updatedEvent) {
    for (var i = 0; i < events.length; i++) {
      if (events[i]._id === updatedEvent._id) {
        events[i] = updatedEvent;
        return;
      }
    }
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
    updateEventList: updateEventList,
  };
});
