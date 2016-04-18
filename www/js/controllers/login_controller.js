controllers.controller('LoginController',
  function($scope, $state, $http, $location, $rootScope, accessFactory,
    HOST, $ionicSlideBoxDelegate, toastService) {

    $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
    $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
    $scope.grantType = 'authorization_code';
    $scope.cliendId = '77fqlypcm1ourl';
    $scope.clientSecret = 'UVKqpbFQchFA8ku0';

    $scope.loginWithLinkedIn = function() {
      var ref = cordova.ThemeableBrowser.open($scope.urlStep1, '_blank', {
        statusbar: {
          color: '#000',
        },
        toolbar: {
          height: 0,
          color: '#000',
        },
      }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
        console.error(e.message);
      }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
        console.log(e.message);
      });

      ref.addEventListener('loadstop', function(event) {
        console.log('loadstop');
        console.log(event.url);
        if ((event.url).startsWith($scope.redirectUri)) {
          ref.executeScript({
              code: 'document.body.innerHTML',
            },
            function(values) {
              var body = values[0];
              var token = JSON.parse(body.substring(body.indexOf('{'),
                body.lastIndexOf('}') + 1));
              if (!token.token) {
                if (token.error) {
                  if (token.error === 'User not found') {
                    $scope.error = 'You are not a accepted member. Please contact an admin';
                    toastService.showLongBottom($scope.error);
                  }
                } else if (token.name) {
                  if (token.name === 'CSRF Alert') {
                    $scope.error = 'There was a security problem when logging in to LinkedIn';
                    toastService.showLongBottom($scope.error);
                  }
                }
              } else {
                accessFactory.changeAccessToken(token.token);
                window.localStorage.token = token.token;
                var date = new Date();
                date.setSeconds(date.getSeconds() + 4320000);
                window.localStorage.tokenExpires = date.getTime();
                $state.go('tab.home');
              }
              ref.close();
            });
        }
      });
    };

    $scope.login = function() {
      if (window.localStorage.tokenExpires && window.localStorage.token) {
        var date = new Date();
        if (date.getTime() < window.localStorage.tokenExpires) {
          accessFactory.changeAccessToken(window.localStorage.token);
          $state.go('tab.home');
        } else {
          $scope.loginWithLinkedIn();
        }
      } else {
        $scope.loginWithLinkedIn();
      }
    };

    $scope.gallery = [{
      url: 'img/coffeeData.jpeg',
      title: 'Stay Connected',
      desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
    }, {
      url: 'img/djakne.png',
      title: 'Enjoy great coffee',
      desc: 'Donec dapibus, magna quis tincidunt finibus, tellus odio porttitor nisi.',
    }, {
      url: 'img/business1.jpeg',
      title: 'Evolve and share',
      desc: 'Praesent faucibus nisi sagittis dolor tristique, a suscipit est vestibulum.',
    }, ];

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  });
