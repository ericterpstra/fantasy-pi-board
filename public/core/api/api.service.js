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
                    console.log(Api.matchups);
                    return response;
                })
                .catch(function (response) {
                    Api.error = angular.copy(response.data);
                    return response;
                });
        },

        selectMatchup: function(id) {
            return $http.post('/matchup', { matchupId: id })
                .then(function (response) {
                    return response;
                });
        }
    };

    return Api;
}]);
