'use strict';

angular.module('fantasyMatchups').component('fantasyMatchups', {
    templateUrl: 'fantasy-matchups/fantasy-matchups.template.html',
    controller: ['$scope', 'Api',
    function FantasyTeamController($scope, Api) {
        var self = this;

        $scope.$watch(function () {
            return Api.matchups;
        }, function (newValue, oldValue) {
            self.matchups = angular.copy(newValue);
            console.log("New matchups: " + JSON.stringify(self.matchups));
        });

        self.matchups = Api.matchups;

        self.changeMatchup = function (id) {
            Api.selectMatchup(id);
        }
    }]
});
