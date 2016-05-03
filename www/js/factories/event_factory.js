factories.factory('EventFactory', function($http, accessFactory, HOST, httpService) {

  var events;
  var oneEvent;

  var addComment = function(eventId, text) {
    var url;
    // var token = accessFactory.getAccessToken();
    // var data = {
    //   token: token,
    //   comment: text,
    // };
    var data = {
      token: 'AQWUSbmYqht3fFXj1Dk_Eb2JdVpbbirqt8TCkGTFp-7zLy_9-EzjsBQX8vGMUMlorvTJtz9KyqWJVb7C0aG_jZcesHXNJCX_k9GX1SLGT3uHTwsjp1g309_rt-EeIfPyFDrKiM8IoxEHmtzIbnt-1PlqUkBvlogddGj5LPP8jNH54i8eQ0g',
      comment: 'Fan vad trevligt, lätt att jag följer med',
    };
    url = HOST.hostAdress + ':4000/events/571f2e9751f7e50a0d5cf909/comment';
    console.log(url);
    httpService.put(url, data, function(err, result) {
      if (err) {
        console.log('NOT OK!');
      } else {
        console.log('Yiiipppiee!');
        console.log('res: ' + result);
      }
    });
  };

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
    addComment: addComment,
  };
});
