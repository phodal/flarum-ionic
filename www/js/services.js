angular.module('starter.services', [])
  .factory('Discussions', function ($resource) {
    var resource = $resource('http://discuss.flarum.org.cn/' + 'api/discussions/:id', {id: '@id'}, {
      update: {method: 'PUT'},
      all: {method: 'GET'}
    });

    return resource;
  })
  .factory('Users', function ($resource) {
    var resource = $resource('http://discuss.flarum.org.cn/' + 'api/users/:id', {
      id: '@id'
    }, {
      update: {method: 'PUT'}
    });

    return resource;
  });
