'use strict';

angular.module('core.api').factory('Api', ['$http',
function($http) {
    var Api = {
        matchups: [],
        error: '',

        updateLeague: function(id) {
            Api.matchups = angular.copy([]);
            Api.error = '';
            return $http.post('/league', { leagueId: id })
                .then(function (response) {
                    console.log(response);
                    Api.matchups = angular.copy(response.data);
                    return response;
                })
                .catch(function (response) {
                    console.log(response);
                    Api.error = angular.copy(response.data);
                    return response;
                });
        },

        selectTeam: function(id) {
            return $http.post('/team', { teamId: id })
                .then(function (response) {
                    return response;
                });
        }
    };

    return Api;
}]);
