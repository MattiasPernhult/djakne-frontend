factories.factory('EventFactory', function($http, accessFactory, HOST, httpService) {

  var events;
  var oneEvent;

  var addComment = function(eventId, text, done) {
    var url;
    var token = accessFactory.getAccessToken();
    var data = {
      token: token,
      comment: text,
    };
    url = HOST.hostAdress + ':4000/events/' + eventId + '/comment';
    console.log(url);
    console.log(data);
    httpService.put(url, data, function(err, result) {
      if (err) {
        console.log('NOT OK!');
      } else {
        console.log('Yiiipppiee!');
        console.log('res: ' + result);
      }
      done(err, result);
    });
  };

  var removeComment = function(eventId, commentId, done) {
    var data = {
      token: accessFactory.getAccessToken(),
    };

    var url = HOST.hostAdress + ':4000/events/' + eventId + '/comment/' + commentId;
    httpService.put(url, data, function(err, result) {
      if (err) {
        console.log('NOT OK!');
        console.log(err);
      } else {
        console.log('Yiiipppiee!');
        console.log('res: ' + result);
      }
      done(err, result);
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
    removeComment: removeComment,
  };
});
