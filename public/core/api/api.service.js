'use strict';

angular.module('core.api').factory('Api', ['$http',
function($http) {
    var Api = {
        leagues: [],
        matchups: [],
        error: '',

        getLeagues: function() {
            Api.leagues = angular.copy([]);
            return $http.get('/leagues')
                .then(function (response) {
                    Api.leagues = angular.copy(response.data[0].leagues);
                    return response;
                });
        },

        updateLeague: function(id) {
            Api.matchups = angular.copy([]);
            Api.error = '';
            return $http.post('/league', { leagueKey: id })
                .then(function (response) {
                    Api.matchups = angular.copy(response.data);
                    return response;
                })
                .catch(function (response) {
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
