angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('CommunityCtrl', function ($scope, Discussions, $http, $state, $rootScope) {
  $scope.$on('$ionicView.beforeEnter', function () {
    if ($rootScope.userId) {
      $scope.isLogin = true;
    }
  });

  Discussions.all().$promise.then(function (response) {
    $scope.topics = response.data;
    $scope.included = response.included;
  });
  $scope.doRefresh = function () {
    Discussions.all().$promise.then(function (response) {
      $scope.topics = response.data;
      $scope.included = response.included;
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
});
