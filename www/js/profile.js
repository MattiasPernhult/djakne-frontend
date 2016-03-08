angular.module('profile', ['ionic', 'ionic.rating'])

.controller('RatingCtrl', function($scope) {

  $scope.ratingFull = {};
  $scope.ratingFull.rate = 3;
  $scope.ratingFull.max = 5;

});
