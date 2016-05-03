services.service('httpService', function($http) {

  var post = function(url, postBody, afterCall) {
    $http.post(url, postBody)
    .success(function(result) {
      afterCall(null, result);
    })
    .error(function(err) {
      afterCall(err, null);
    });
  };

  var put = function(url, putBody, afterCall) {
    $http.put(url, putBody)
    .success(function(result) {
      afterCall(null, result);
    })
    .error(function(err) {
      afterCall(err, null);
    });
  };

  var get = function(url, afterCall) {
    $http.get(url)
    .success(function(result) {
      afterCall(null, result);
    })
    .error(function(err, status) {
      afterCall(err, null, status);
    });
  };

  var del = function(url, deleteBody, afterCall) {
    $http.delete(url)
    .success(function(result) {
      afterCall(null, result);
    })
    .error(function(err, status) {
      afterCall(err, null, status);
    });
  };

  return {
    get: get,
    put: put,
    post: post,
    delete: del,
  };
});
