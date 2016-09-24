'use strict';

angular.module('fantasyApp').config(['$locationProvider','$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      when('/', {
        template: '<fantasy-index></fantasy-index>'
      }).
      otherwise('/');
  }
]);
