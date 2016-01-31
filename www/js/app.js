// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngResource',
  'angularMoment',
  'ngMessages',
  'starter.controllers',
  'starter.services'
])

  .run(function ($ionicPlatform, amMoment) {
    amMoment.changeLocale('zh-cn');

    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.community', {
        url: '/community',
        views: {
          'menuContent': {
            templateUrl: 'templates/community.html',
            controller: 'CommunityCtrl'
          }
        }
      })

      .state('app.topic-create', {
        url: '/topic/create',
        views: {
          'menuContent': {
            templateUrl: 'templates/community/create.html',
            controller: 'CreateCtrl'
          }
        }
      })

      .state('app.topic', {
        url: '/topic/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/community/topic.html',
            controller: 'TopicCtrl',
            resolve: {
              discussion: function (Discussions, $stateParams) {
                return Discussions.get({id: $stateParams.id});
              }
            }
          }
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/community/login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'templates/community/signin.html',
            controller: 'SigninCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/community');
  });
