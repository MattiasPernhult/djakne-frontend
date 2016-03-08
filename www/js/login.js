angular.module('login', ['config'])

.service('accessService', function() {
  var accessToken = '';

  var changeAccessToken = function(token)  {
    accessToken = token;
  };

  var getAccessToken = function() {
    return accessToken;
  };

  return {
    changeAccessToken: changeAccessToken,
    getAccessToken: getAccessToken,
  };
})

.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', 'accessService',
'HOST', function($scope, $http, $location, $rootScope, accessService, HOST) {
  console.log(HOST.hostAdress);
  $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
  $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
  $scope.grantType = 'authorization_code';
  $scope.cliendId = '77fqlypcm1ourl';
  $scope.clientSecret = 'UVKqpbFQchFA8ku0';
  $scope.login = function() {

    var ref = window.open($scope.urlStep1, '_self');

    ref.addEventListener('loadstop', function(event) {
      if ((event.url).startsWith($scope.redirectUri)) {
        ref.executeScript({
            code: 'document.body.innerHTML',
          },
          function(values) {
            var body = values[0];
            var token = body.substring(body.indexOf('{') + 10, body.lastIndexOf('}') - 1);
            accessService.changeAccessToken(token);
            ref.close();
            $rootScope.$apply(function() {
              $location.path('/tab/home');
            });
          }
        );
      }
    });
  };
},]);
