controllers.controller('HomeController', function($scope, CoffeeFactory, $http, HOST,
  accessFactory, $ionicModal, MembersFactory, httpService, toastService, $ionicSlideBoxDelegate,
  EventFactory, $timeout) {

  $scope.votes = 2;
  $scope.body = {};
  $scope.icon = {
    src: './img/Icons/home/news_black.png',
  };

  // For the icons
  $scope.getCurrentIndex = function() {
    return $ionicSlideBoxDelegate.currentIndex();
  };

  $scope.changeLogo = function() {
    var index = $scope.getCurrentIndex();
    var src = $scope.icons[index].src;
    $scope.icon.src = src;
  };

  $scope.icons = [
    {
      name: 'Recent',
      src: 'img/Icons/home/news_black.png',
    },
    {
      name: 'Co-work',
      src: 'img/Icons/home/join_black.png',
    },
    {
      name: 'Events',
      src: 'img/Icons/home/event_black.png',
    },
  ];

  $scope.doRefresh = function() {
    MembersFactory.getMembers(function(err, data) {
      if (!err) {
        $timeout(function() {
          $scope.members = data.members;
          $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
      }
    });
  };
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
    console.log('getCoffee');
    $scope.rating = data;
  });

  MembersFactory.getMembers(function(err, data)  {
    if (!err) {
      $scope.members = data.members;
    }
  });

  $ionicModal.fromTemplateUrl('modal.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('currentCoffee.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modalCoffee = modal;
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

  $scope.openCoffeeModal = function(coffee) {
    console.log($scope.currentCoffee);
    $scope.modalCoffee.show();
  };

  $scope.closeCoffeeModal = function() {
    $scope.modalCoffee.hide();
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

  // Kaffe
  CoffeeFactory.getCoffee(function(data) {
    $scope.currentCoffee = data;
    $scope.currentCoffee.text = $scope.currentCoffee.description;
  });

});
