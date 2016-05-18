controllers.controller('HomeController', function($scope, CoffeeFactory, $http, HOST,
  accessFactory, $ionicModal, MembersFactory, NewsFactory, httpService, toastService, $ionicSlideBoxDelegate,
  EventFactory, $timeout, Cart, $ionicPopup, $ionicSideMenuDelegate) {

  $scope.votes = 2;
  $scope.body = {};

  $scope.$on('$ionicView.enter', function() {
    $scope.getFavorites();
  });

  // GET functions


  CoffeeFactory.getCoffee(function(err, data) {
    // TODO: Provide some message to the user, if there is some error
    if (!err) {
      console.log(data);
      $scope.rating = data;
    }
  });

  NewsFactory.getNews(function(err, data) {
    console.log('getNews');
    // TODO: Provide some message to the user, if there is some error
    if (!err) {
      console.log(data);
      $scope.issues = data.issues;
    }
  });

  MembersFactory.getMembers(function(err, data)  {
    // TODO: Provide some message to the user, if there is some error
    if (!err) {
      console.log(data);
      $scope.members = data.members;
    }
  });

  // Refresh content

  $scope.doMemberRefresh = function() {
    MembersFactory.getMembers(function(err, data) {
      if (!err) {
        $timeout(function() {
          $scope.members = data.members;
          $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
      }
    });
  };

  $scope.doEventRefresh = function() {
    EventFactory.getEvents(function(data) {
      console.log('i refresh, data= ' + data);
      if (data) {
        $timeout(function() {
          $scope.events = data;
          $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
      }
    });
  };

  // Rating

  $scope.ratingsObject = {
    iconOn: 'ion-ios-star',
    iconOff: 'ion-ios-star-outline',
    iconOnColor: 'rgb(152, 139, 139)',
    iconOffColor: 'rgb(152, 139, 139)',
    rating: $scope.votes,
    minRating: 1,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    },
  };

  $scope.send = function() {
    var rating = {
      vote: String($scope.votes),
      token: accessFactory.getAccessToken(),
    };

    var url = HOST.hostAdress + ':4000/coffee/vote';

    httpService.put(url, rating, function(err, result) {
      if (err) {
        toastService.showLongBottom(err.error);
      } else {
        toastService.showLongBottom('You have now voted for this weeks coffee');
      }
    });
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
    $scope.votes = rating;
  };

  // favorites

  $scope.removeFavorite = function(index) {
    $scope.userFavorites.splice(index, 1);
    window.localStorage.setItem('favorites', JSON.stringify($scope.userFavorites));
  };

  $scope.getFavorites = function() {
    var res;
    var favorites;
    res = window.localStorage.getItem('favorites');
    favorites = JSON.parse(res);
    $scope.userFavorites = favorites || [];
  };

  $scope.isFavorite = function(item)  {
    for (var index = 0; index < $scope.userFavorites.length; index++) {
      if (item.id === $scope.userFavorites[index].id) {
        return true;
      }
    }
    return false;
  };

  $scope.favoritesSize = function() {
    var favSize = $scope.userFavorites.length;
    return favSize;
  };

  $scope.toogleFavorite = function(item) {
    var exists = false;
    for (var index = 0; index < $scope.userFavorites.length; index++) {
      if (item.id === $scope.userFavorites[index].id) {
        exists = true;
        item.isFavorite = false;
        $scope.removeFavorite(index);
        break;
      }
    }
    if (!exists) {
      item.isFavorite = true;
      $scope.addFavorite(item);
    }
  };

  // Cart

  $scope.addToCart = function(product) {
    Cart.add(product);
  };

  $scope.buyNow = function(item) {
    var takeaway = false;
    var message = '';
    item.qty = 1;

    if (window.localStorage.Takeaway) {
      takeaway = true;
    }
    if (window.localStorage.Lactose) {
      message += 'Laktosfritt: Ja';
    }

    Cart.order(message, takeaway, item);
  };

  $scope.showConfirm = function(item) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Do you want to fast buy one ' + item.name + '?',
    });

    confirmPopup.then(function(res) {
      if (res) {
        $scope.buyNow(item);
      } else {
        $scope.showAlert();
      }
    });
  };

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Order',
      template: 'Your order is cancelled',
    });
  };

  // Watch for changes in cart size
  $scope.$watch(function() {
      return Cart.size();
    },
    function(newVal) {
      $scope.cartQty = newVal;
      if (newVal === 0 && $ionicSideMenuDelegate.isOpen()) {
        $ionicSideMenuDelegate.toggleRight();
      }
    }
  );

  // Watch for changes in cart size
  // $scope.$watch(function() {
  //     return $scope.userFavorites.length;
  //   },
  //   function(newQty) {
  //     $scope.favQty = newQty;
  //     console.log($scope.favQty);
      // if (newQty == 1) {
      //   console.log('Hej');
      //   $scope.favoriteModal.isShown()
      //   $scope.favoriteModal.hide();
      // }
  //   }
  // );



  // Modals

  $ionicModal.fromTemplateUrl('modals/viewMember.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('modals/currentCoffee.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modalCoffee = modal;
  });

  $ionicModal.fromTemplateUrl('modals/currentNews.html', {
    id: '3',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.modalNews = modal;
  });

  $ionicModal.fromTemplateUrl('modals/favorites.html', {
    id: '4',
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal)  {
    $scope.favoriteModal = modal;
  });

  $scope.openModal = function(member) {
    $scope.member = member;
    console.log($scope.member);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.openCoffeeModal = function(coffee) {
    console.log($scope.currentCoffee);
    $scope.modalCoffee.show();
  };

  $scope.closeCoffeeModal = function() {
    $scope.modalCoffee.hide();
  };

  $scope.openNewsModal = function() {
    $scope.modalNews.show();
  };

  $scope.closeNewsModal = function() {
    $scope.modalNews.hide();
  };

  $scope.openFavoriteModal = function() {
    $scope.favoriteModal.show();
  };

  $scope.closeFavoriteModal = function() {
    $scope.favoriteModal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.gotoLinkedIn = function() {
    window.open($scope.member.linkedInProfile, '_system');
  };

  //
  // $scope.next = function() {
  //   $ionicSlideBoxDelegate.next();
  // };
  //
  // $scope.previous = function() {
  //   $ionicSlideBoxDelegate.previous();
  // };
  //
  // // Called each time the slide changes
  // $scope.slideChanged = function(index) {
  //   $scope.slideIndex = index;
  // };

  // Kaffe
  // CoffeeFactory.getCoffee(function(data) {
  //   $scope.currentCoffee = data;
  //   $scope.currentCoffee.text = $scope.currentCoffee.description;
  // });

});
