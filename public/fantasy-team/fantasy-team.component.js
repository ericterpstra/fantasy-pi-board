'use strict';

angular.module('fantasyTeam').component('fantasyTeam', {
    templateUrl: 'fantasy-team/fantasy-team.template.html',
    controller: ['$scope', 'Api',
    function FantasyMatchupsController($scope, Api) {
        var self = this;

        $scope.$watch(function () {
            return Api.matchups;
        }, function (newValue, oldValue) {
            self.matchups = angular.copy(newValue);
        });

        self.matchups = Api.matchups;

        self.changeMatchup = function (id) {
            console.log("Changing team: " + id);
            Api.selectMatchup(id);
        }
    }]
});
