controllers.controller('LoginController',
  function($scope, $state, $http, $location, $rootScope, accessFactory,
    HOST, $ionicSlideBoxDelegate, toastService, httpService, $ionicPopup, $timeout) {

    $scope.urlStep1 = HOST.hostAdress + ':3000/oauth/linkedin/ios';
    $scope.redirectUri = HOST.hostAdress + ':3000/oauth/linkedin/ios/callback';
    $scope.grantType = 'authorization_code';
    $scope.cliendId = '77fqlypcm1ourl';
    $scope.clientSecret = 'UVKqpbFQchFA8ku0';

    $scope.loginWithLinkedIn = function() {
      //  var ref = cordova.ThemeableBrowser.open($scope.urlStep1, '_blank', {
      //    statusbar: {
      //      color: '#000',
      //    },
      //    toolbar: {
      //      height: 0,
      //      color: '#000',
      //    },
      //  }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
      //    console.error(e.message);
      //  }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
      //    console.log(e.message);
      //  });

      var ref = cordova.InAppBrowser.open($scope.urlStep1, '_blank');
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
          var url = HOST.hostAdress + ':3000/member?token=' + window.localStorage.token;
          httpService.get(url, function(err, result, status) {
            if (err && status !== 200) {
              $scope.loginWithLinkedIn();
            } else {
              if (checkIfUsersBirthday(result.member)) {
                alertUser(result.member.firsName);
              }
              accessFactory.changeAccessToken(window.localStorage.token);
              $state.go('tab.home');
            }
          });
        } else {
          $scope.loginWithLinkedIn();
        }
      } else {
        $scope.loginWithLinkedIn();
      }
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

    var checkIfUsersBirthday = function(user) {
      var date = new Date();
      var usersBirthday = new Date(user.dob);
      if (!Date.parse(usersBirthday)) {
        return false;
      }
      if ((usersBirthday.getUTCDate() + 1) === date.getUTCDate() &&
       (usersBirthday.getUTCMonth() === date.getUTCMonth())) {
        return true;
      }
      return false;
    };

    var alertUser = function(userFirstName) {
      var alertPopUp = $ionicPopup.alert({
        title: 'Happy Birthday!',
        template: userFirstName + ' it seems like it\'s your birthday!' +
        'We hope that you\'ll have a great day!',
      });
    };
  });
