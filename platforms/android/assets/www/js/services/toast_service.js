services.service('toastService', function($cordovaToast) {

  var showLongBottom = function(message) {
    $cordovaToast.showLongBottom(message)
    .then(function(success) {
      // success
      console.log('---- TOAST SUCCESS ----');
      console.log(JSON.stringify(success));
      console.log('-----------------------');
    }, function(error) {
      console.log('---- TOAST ERROR ----');
      console.log(JSON.stringify(error));
      console.log('-----------------------');
    });
  };

  return {
    showLongBottom: showLongBottom,
  };
});
