services.service('debugService', function() {
  var debug = true;

  var isDebug = function() {
    return debug;
  };

  return {
    isDebug: isDebug,
  };
});
