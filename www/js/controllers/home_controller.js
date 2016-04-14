controllers.controller('HomeController', function($scope, CoffeeFactory, $http, HOST,
  accessFactory, $ionicModal, MembersFactory, httpService, toastService, $ionicSlideBoxDelegate,
  EventFactory) {

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

  $scope.sliderGallery = [];
  EventFactory.getEvents(function(data) {
   var events = data;
   console.log(events);
   var obj = events.sort(function(a,b) {
     return new Date(a.date) - new Date(b.date);
   });
   var currentEvent = obj[0];
   // Ta bort rad 13 sen när events fått bilder
   currentEvent.image = 'http://m.c.lnkd.licdn.com/mpr/mpr/AAEAAQAAAAAAAAgOAAAAJGEwMzU4Y2EyLWM5ZWUtNDRmYy1hMzcxLTdjMjdhNTA2YjI3Mg.jpg';
   $scope.sliderGallery.push(currentEvent);
 });

  // För veckans kaffe


  CoffeeFactory.getCoffee(function(data) {
  $scope.rating = data;
  $scope.rating.text = $scope.rating.description;
  $scope.sliderGallery.push($scope.rating);
});

});
