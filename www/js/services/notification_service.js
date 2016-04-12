services.service('notificationService', function($cordovaLocalNotification) {

  var schedule = function(notification) {
    $cordovaLocalNotification.schedule(notification);
  };
});
