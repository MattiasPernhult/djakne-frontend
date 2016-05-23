controllers.controller('CalendarController', function($scope, $cordovaCalendar) {

  $cordovaCalendar.createCalendar({
    calendarName: 'Djäkne Calendar',
    calendarColor: '#444',
  }).then(function(result) {
    console.log('Calendar created with no errors');
    alert(JSON.stringify(result));
  }, function(err) {
    console.log('ERROR with Calendar');
    console.log(err);
  });
});
