controllers.controller('LoginController',
  function($scope, $state, $http, $location, $rootScope, accessFactory,
    HOST, $ionicSlideBoxDelegate) {

    $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
    $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
    $scope.grantType = 'authorization_code';
    $scope.cliendId = '77fqlypcm1ourl';
    $scope.clientSecret = 'UVKqpbFQchFA8ku0';

    $scope.login = function() {

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
        if ((event.url).startsWith($scope.redirectUri)) {
          ref.executeScript({
              code: 'document.body.innerHTML',
            },
            function(values) {
              var body = values[0];
              var token = body.substring(body.indexOf('{') + 10, body.lastIndexOf('}') - 1);
              accessFactory.changeAccessToken(token);
              ref.close();
              $state.go('tab.home');
            });
        }
      });
    };

    $scope.gallery = [{
      url: 'img/business1.jpeg',
      title: 'Evolve and share',
      desc: 'A place for creative and driven builders',
    }, {
      url: 'img/djakne.png',
      title: 'Enjoy great coffee',
      desc: 'We believe great coffee leads to higher efficiency',
    }, {

      url: 'img/coffeeData.jpeg',
      title: 'Stay Connected',
      desc: 'Secured & good Wi-Fi and power outlets provided',
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
