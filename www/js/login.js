angular.module('login', [])

.controller('MenuController', function($scope, $http, $location, accessService) {
  $scope.accessToken = accessService.getAccessToken();

  $scope.getMenu = function() {
    var url = 'http://192.168.43.39:3000/menu?token=' + $scope.accessToken;
    $http({
        method: 'get',
        url: url,
      })
      .success(function(data) {
        $scope.products = data;
      })
      .error(function(error, status) {
        console.log('ERROR: ' + error);
      });
  };
})

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

.controller('LoginController', function($scope, $http, $location, $rootScope, accessService) {

  $scope.urlStep1 = 'http://192.168.43.39:3000/oauth/linkedin/ios';
  $scope.redirectUri = 'http://192.168.43.39:3000/oauth/linkedin/ios/callback';
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
              $location.path('/menu');
            });
          }
        );
      }
    });
  };
});
