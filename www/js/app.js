angular.module('starter', ['ionic', 'ionic-ratings', 'controllers', 'factories'
, 'config', 'ngCordova','ionic-datepicker',])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController',
  })

    .state('cart', {
      url: '/cart',
      templateUrl: 'templates/cart.html',
      controller: 'ProductController',
    })

    .state('eventMain', {
        url: '/eventMain',
        templateUrl: 'templates/eventMain.html',
        controller: 'EventController',
      })

    .state('events_description', {
      url: '/events_description',
      templateUrl: 'templates/events_description.html',
      controller: 'EventDescriptionController',
    })

    .state('addEvent', {
      url: '/addEvent',
      templateUrl: 'templates/addEvent.html',
      controller: 'AddEventController',
    })

    .state('boardMain', {
      url: '/boardMain',
      templateUrl: 'templates/boardMain.html',
      controller: 'EventController',
    })

    .state('newsMain', {
      url: '/newsMain',
      templateUrl: 'templates/newsMain.html',
      controller: 'EventController',
    })

    .state('memberships', {
      url: '/memberships',
      templateUrl: 'templates/memberships.html',
      controller: 'EventController',
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeController',
      },
    },
  })

  .state('tab.co', {
      url: '/co',
      views: {
        'tab-co': {
          templateUrl: 'templates/tab-co.html',
          controller: 'EventController',
        },
      },
    })

    .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: 'templates/tab-profile.html',
            controller: 'ProfileController',
          },
        },
      })

  .state('tab.menu', {
    url: '/menu',
    views: {
      'tab-menu': {
        templateUrl: 'templates/tab-menu.html',
        controller: 'ProductController',
      },
    },
  });


  var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: false,
    weeksList: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    monthsList: ['Ja','Feb', 'March', 'April', 'May', 'June', 'July', 'Aug',
    'Sept', 'Oct', 'Nov', 'Dec',],
    templateType: 'popup',
    from: new Date(2012, 8, 1),
    to: new Date(2018, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: [6],
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);


  // if none of the above states are matched, use this as the fallback
  if (window.cordova) {
    $urlRouterProvider.otherwise('/login');
  } else {
    $urlRouterProvider.otherwise('/tab/home');
  }
});
