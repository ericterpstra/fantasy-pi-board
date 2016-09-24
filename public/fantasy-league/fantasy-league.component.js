'use strict';

angular.module('fantasyLeague').component('fantasyLeague', {
    templateUrl: 'fantasy-league/fantasy-league.template.html',
    controller: ['$scope', 'Api',
    function FantasyLeagueController($scope, Api) {
        var self = this;

        self.error = '';

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
