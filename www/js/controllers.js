angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

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
  })

  .controller('LoginCtrl', function ($scope, $http, $rootScope, $ionicHistory) {
    $scope.user = {};
    $scope.isLogin = $rootScope.userId;

    $scope.doLogin = function (user) {
      var payload = {
        identification: user.username,
        password: user.password
      };

      $http.post('http://forum.growth.ren/' + 'api/token', payload)
        .success(function (data) {
          $scope.isLogin = true;
          $rootScope.userId = data.userId;
          $ionicHistory.goBack(-1);
        })
        .error(function (data, status) {
          if (status === 401) {
            $scope.error = '用户名或密码错误'
          }
        });
    };
  })
  .controller('SigninCtrl', function ($scope, $http, $state, $ionicPopup) {
    $scope.user = {
      username: '',
      password : '',
      email: ''
    };

    $scope.signIn = function() {
      var payload = {
        username: $scope.user.username,
        email: $scope.user.email,
        password: $scope.user.password
      };

      $http.post('http://forum.growth.ren/register', payload)
        .success(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: '注册成功',
            template: '欢迎你，' + $scope.user.username + '。我们已经发送了一封邮件至 ' + $scope.user.email + '，请打开它并完成账号激活。'
          });

          alertPopup.then(function(res) {
            $state.go('app.community');
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        })
        .error(function (data, status) {
          console.log(data.errors);
          $scope.errors = data.errors
        });

    };
  })

  .controller('TopicCtrl', function ($scope, $stateParams, $filter, discussion, $rootScope, $http, $window) {
    $scope.$on('$ionicView.beforeEnter', function () {
      if ($rootScope.userId) {
        $scope.isLogin = true;
      }
    });

    $scope.isShowCommentBox = false;
    $scope.showCommentBox = function () {
      $scope.isShowCommentBox = true;
    };

    discussion.$promise.then(function (response) {
      $scope.replyContent = '';
      var postId = response.data.relationships.posts.data[0].id;
      $scope.topic = response.data;
      $scope.discussionID = response.data.id;
      $scope.discussions = response.included;

      $scope.post = $filter('filter')(response.included, {type: "posts", id: postId})[0];
      $scope.user = $filter('filter')(response.included, {type: "users"})[0];

      $scope.discussion = response;
    });

    $scope.getUsername = function (user) {
      var included = $scope.discussion.included;
      for (var i = 0; i < included.length; ++i) {
        if (included[i].type === 'users' && included[i].id === user.data.id) {
          return included[i].attributes.username;
        }
      }
      return 'A user';
    };

    $scope.getAvatar = function (user) {
      var included = $scope.discussion.included;
      for (var i = 0; i < included.length; ++i) {
        if (included[i].type === 'users' && included[i].id === user.data.id && included[i].attributes.avatarUrl) {
          return included[i].attributes.avatarUrl;
        }
      }
    };

    $scope.isLiked = function (relationships) {
      console.log(relationships);
      var isLike = false;
      var userId = relationships.user.data.id;
      angular.forEach(relationships.likes.data, function(like){
        console.log(like);
        if( userId === like.id) {
          isLike = true;
        }
      });
      return isLike;

    };

    $scope.encodeHTML = function (html) {
      return html.replace('href=', 'src=');
    };

    $scope.replyToUser = '';
    $scope.replyToId = '';

    $scope.replyTo = function (user, id) {
      $scope.isShowCommentBox = true;
      $scope.replyToUser = user;
      $scope.replyToId = id;
    };

    $scope.saveReply = function () {
      var content = $scope.replyContent;
      if ($scope.replyToUser !== '' && $scope.replyToUser !== '') {
        content = '@' + $scope.replyToUser + '#' + $scope.replyToId + $scope.replyContent;
      }

      var reply = {
        "data": {
          "type": "posts",
          "attributes": {"content": content},
          "relationships": {"discussion": {"data": {"type": "discussions", "id": $stateParams.id}}}
        }
      };

      $http({
        method: 'POST',
        url: 'http://forum.growth.ren/api/posts',
        data: reply,
        headers: {
          'Authorization': 'Token ' + $window.localStorage.getItem('token')
        }
      }).success(function (response) {
        $scope.isShowCommentBox = false;
        $scope.replyContent = '';
        $scope.discussions.push(response.data);
      }).error(function (data, status) {
        if (status === 401) {
          $scope.modal.show();
        }
      })
    };

    $scope.LikeIt = function (ID) {
      var like = {
        "data": {
          "type": "posts",
          "id": ID.toString(),
          "attributes": {
            "isLiked": true
          }
        }
      };

      $http({
        method: 'POST',
        url: 'http://forum.growth.ren/api/posts/' + ID,
        data: like,
        headers: {
          'X-Fake-Http-Method': 'PATCH',
          'Authorization': 'Token ' + $window.localStorage.getItem('token')
        }
      }).success(function (response) {

      }).error(function (data, status) {
        if (status === 401) {
          $scope.modal.show();
        }
      })
    };
  })
  .controller('ProfileCtrl', function ($scope, Users, $stateParams) {
    Users.get({id: $stateParams.id}).$promise.then(function (response) {
      $scope.userId = response.data.id;
      $scope.userInfo = response.data.attributes;
      $scope.addInfo = response.included;
    });
  })

  .controller('CreateCtrl', function ($scope, $http, $state, $window) {
    $scope.post = {
      title: '',
      content: ''
    };

    $scope.isInCreating = false;
    $scope.create = function (){
      $scope.isInCreating = true;
      var data = {
        "data": {
          "attributes": {
            "content": $scope.post.content,
            "title": $scope.post.title
          },
          "relationships": {"tags": {"data": [{"id": "3", "type": "tags"}, {"id": "1", "type": "tags"}]}},
          "type": "discussions"
        }
      };
      $http({
        method: 'POST',
        url: 'http://forum.growth.ren/api/discussions',
        data: data,
        headers: {
          'Authorization': 'Token ' + $window.localStorage.getItem('token')
        }
      }).success(function (response) {
        $scope.isInCreating = false;
        $state.go('app.topic', {id: response.data.id});
      }).error(function(data, status){
        $scope.isInCreating = false;
        if(status === 401){
          $scope.modal.show();
        }
      })
    }
  });

