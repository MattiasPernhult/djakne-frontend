services.service('httpService', function($http) {

  var post = function(url, postBody, afterCall) {
    $http.post(url, postBody)
    .success(handleSuccess)
    .error(handleError);
  };

  var put = function(url, putBody, afterCall) {
    $http.put(url, putBody)
    .success(handleSuccess)
    .error(handleError);
  };

  var get = function(url, afterCall) {
    $http.get(url)
    .success(handleSuccess)
    .error(handleError);
  };

  var handleSuccess = function(result, afterCall) {
    afterCall(null, result);
  };

  var handleError = function(err, afterCall) {
    afterCall(err, null);
  };

  return {
    get: get,
    put: put,
    post: post,
  };
});
