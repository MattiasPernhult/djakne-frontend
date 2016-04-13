controllers.controller('HomeController', function($scope, CoffeeFactory, $http, HOST,
  accessFactory, $ionicModal, MembersFactory, httpService, toastService, $ionicSlideBoxDelegate) {

  $scope.votes = 2;
  $scope.body = {};

  $scope.ratingsObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(0, 0, 0)',
    iconOffColor: 'rgb(100, 100, 100)',
    rating: $scope.votes,
    minRating: 1,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    },
  };

  CoffeeFactory.getCoffee(function(data) {
    $scope.rating = data;
  });

  MembersFactory.getMembers(function(err, data)  {
    if (!err) {
      $scope.members = data.members;
    }
  });

  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modal = modal;
  });

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
    $scope.votes = rating;
  };

  $scope.send = function() {
    var rating = {
      vote: String($scope.votes),
      token: accessFactory.getAccessToken(),
    };

    var url = HOST.hostAdress + ':4000/coffee/vote';

    httpService.put(url, rating, function(err, result) {
      if (err) {
        toastService.showLongBottom(err.result);
      } else {
        toastService.showLongBottom('Ditt resultat har skickats');
      }
    });
  };

  $scope.openModal = function(member) {
    $scope.member = member;
    console.log($scope.member);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });

  $scope.gotoLinkedIn = function() {
    window.open($scope.member.linkedInProfile, '_system');
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
