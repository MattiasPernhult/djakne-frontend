controllers.controller('EventDescriptionController',
  function($scope, $http, EventFactory, accessFactory, HOST, httpService,
    toastService, $stateParams, ProfileFactory, $state) {
    var eventData = EventFactory.getEvent();
    $scope.chosenEvent = eventData;
    $scope.image = '/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8KCwkMEQ8SEhEP' +
    'ERATFhwXExQaFRARGCEYGhwdHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4' +
    'eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABQAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAA' +
    'AAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS' +
    '0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipK' +
    'TlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QA' +
    'HwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhc' +
    'RMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpan' +
    'N0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn' +
    '6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD41oo6UVQBRRRQAUUUUAFFFFABRRQaAE70tFFABSgZOBSVLaEC6iJGR' +
    'uHFJgtS5a6ReXAHlwyOzdFVck1WvrO4spjDcxPG46hhivavAk0VjpqSyWJKNHkTA5bPOB0/rXG/Emxu5IRqVysYDrv' +
    'Uqu3jcoHc5+9XHTxLlPlZ21MLy0uc8/ooortOIKDRQaAFwaSt250tJk3xYR8dOxrIngkhfa6EGsoVVLY1qUZQ3IaUH' +
    'BBFLj2r0r4afCfVvFAt7+9L2Wly4IkAy7r7ensTWlzNK50fwy1dtU8OG2CJFNFOoOehwASR6c847Vz3xnvnS3sNKE' +
    'm4pvLkdNuflX8M16/onw5tvBvnQIGnsJ3BjmlwSzY6H0OP5VXtPC1rqfjNheaZb3VikJ8zzIgwXOCCPToP1ryoNLE' +
    'baHrzcpYa1z5aor3r44/C/TLDRzrvhu0+z/Z8/aIEyVZepYDsRXgteqnc8hqwUUUUxHpVt4a11s/8STUuOT/or8' +
    'fpU+j+GL7VdRGnWulSXl4xIWFYC8mR1GMZr6Y8LXuheH9Hj0mLXrS6jhhaNZHuELNlt3PNcf8ACSF7Hxr/AG7p8g3W' +
    'c7ByOcbgR/I185WxPs/e6XPqcPTdW6tqlc888N/Da9l8XWOlaz4enso3k/eedZlOACccgdcY/GvqHTdKt7azS2hh' +
    'VERNoUDjA6Vznxh8UanHdaXqsEqi6jBiDlA3DPGDwRjoTVrQ/FF3dz21rNDE7T5AdfkK4BPToelduGxEWrX3PPxVKc3z' +
    'WSsjJ8Y+OofC8stsdNvZ5E4XBRIyfTcxz+QNeXeJfi14hltN2l6ZpOnxyAsQzGd/xwFAP1Hatz41vLceL/7OeP8A1kcc' +
    'qMBnCEFST+KH8q5m30XSbF5TeQvdguDH1Hy57gdc8CumlU1aluYyw/NFOOxu/CXW9S8VaVqaa3cteOJgq74EiwrLyML' +
    '1HHWvAviD4aGj67ftpwaXTUnIjf8AujPT6dga3viBqWsQXdm+nPeWJSFrd/spaMMqkDDbevfg1mQeKHns5LTVLVvnGDI' +
    'EPP1FaOU0lKKOZRp3cJPXocRSdq1NV077JMrgFoX5Ujjj+lMsdI1K+t5LiztJZooc+YyjIXgnn8Aa151a9zDklzct' +
    'tT0eysbqbiOKVz0+UE1raRpviq2lHkarPYsW+VYpmLnnjAU9a7rw5LaPfWz3ew2wYF0OFQL71BcXlvZ65dXOnwh' +
    'Y1ud8JjwqDoQQfr6V5f7m1qcXN/cj6H2tVytVkoL72c5eXur2+qW9prN3rU00jLk328BhuByA/PUCvXfh+/n6/CWB' +
    'xDCzfQkY/qa4Hx34p1XxRDHHehHjt38yI4JZT3+Y8/kBXa/DS5VdXjVjkXdvgc8ZXn+WaVWm4VYcyS9DmjWjUpS5G' +
    '3buZ3xmn1GLxvbTWkCPEllHuIUMc7pMqfQYI7fSuUtNfezP27UZ2aaFgzJtJBxwqj6Dnn0rsPiPqtpa+On068UReb' +
    'DG8E4wAvBBB/EcH6/hgeJY4rqwaP7NNOi53h2LHn0PbHHHPbGa6qVSPtHGa3ErqknBnANfXSGe70eS4eCed3IkjBI' +
    'OcnOM+tVpNe1teJI4j/vwCt3wgJ7KGXEQkgS6cBDJ6YyDg4/GvQ9W8Y6FeaGLAeCLW2uFX5LiK5fdnuSD1+laSclJ8' +
    'sml8jKFamoJSgm/ncj8N+CbvxF4Pt7rRtM1G51a41hrGJvPgS1ZFtzKUwzBxJhScn5MDGd3Fc38QPDXiHwno5l17' +
    'R57L7VYvcW6zDiRQuSDg8MOMocMMjIGRXafDf4mjwdpVhYf2L9t+yaxJqe/7V5W/fatb+XjYcY3bs+2Md65Lxt4qT' +
    'U/hto3hv8As5c6JDejeZt32nz33424G3GMdTnOeK+7niJ+8m48mvVbWfn6dOp+TUsLTvCSUvaXWlnvePl5y1v0' +
    '8z//2Q==';
    $scope.showImage = false;

    $scope.$watch(function() {
        return EventFactory.getEvent();
      },
      function(newVal) {
        $scope.chosenEvent = newVal;
      }
    );

    $scope.signUp = function() {
      var url = HOST.hostAdress + ':4000/events/register/' + $scope.currentEvent._id;
      var body = {
        token: accessFactory.getAccessToken(),
      };

      httpService.post(url, body, function(err, result) {
        if (err) {
          toastService.showLongBottom('You are already attending this event');
        } else {
          $scope.showImage = true;
          $scope.currentEvent = result.data;
          toastService.showLongBottom('You are now signed up for the event');
        }
      });
    };

    $scope.userComment = {};

    // Get event parameter
    $scope.currentEvent = $stateParams.eventParam;

    // Get user parameter
    $scope.user = $stateParams.userParam;

    // Get user obj
    ProfileFactory.getUser(function(data) {
      $scope.user = JSON.parse(data);
    });

    // Function to add comment
    $scope.addComment = function(eventId) {
      var text = $scope.userComment.text;
      EventFactory.addComment(eventId, text, function(err, result) {
        if (err) {
          toastService.showLongBottom(err.error);
        } else {
          $scope.userComment.text = null;
          $scope.currentEvent = result;
          EventFactory.updateEventList(result);
          $scope.show = true;
        }
      });
    };

    // Function to remove comment
    $scope.removeComment = function(eventId, commentId) {
      EventFactory.removeComment($scope.currentEvent._id, commentId, function(err, result) {
        if (err) {
          toastService.showLongBottom(err.error);
        } else {
          $scope.currentEvent = result;
          EventFactory.updateEventList(result);
          $scope.show = true;
        }
      });
    };

    $scope.removeEvent = function(eventId) {
      EventFactory.removeEvent(eventId, function(err, result) {
        if (err) {
          toastService.showLongBottom(err.error);
        } else {
          $scope.events = EventFactory.removeEventFromList(eventId);
          toastService.showLongBottom('The event was successfully deleted');
          $state.go('tab.home');
        }
      });
    };
  });
