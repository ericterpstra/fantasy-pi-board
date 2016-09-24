'use strict';

angular.module('fantasyLeague').component('fantasyLeague', {
    templateUrl: 'fantasy-league/fantasy-league.template.html',
    controller: ['$scope', 'Api',
    function FantasyLeagueController($scope, Api) {
        var self = this;

        self.error = '';
        self.leagues = [];

        Api.getLeagues();

        $scope.$watch(function () {
            return Api.leagues;
        }, function (newValue, oldValue) {
            self.leagues = angular.copy(newValue);
        });

        $scope.$watch(function () {
            return Api.error;
        }, function (newValue, oldValue) {
            self.error = angular.copy(newValue);
        });

        self.setLeague = function (league) {
            Api.updateLeague(league);
        }
    }]
});
