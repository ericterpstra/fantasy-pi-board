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

        self.selectTeam = function (id) {
            Api.selectTeam(id);

            for (var i = 0; i < self.matchups.length; i++) {
                if (self.matchups[i].home.selected && (self.matchups[i].home.id !== id)) {
                    self.matchups[i].home.selected = false;
                }

                if (self.matchups[i].home.id === id) {
                    self.matchups[i].home.selected = true;
                }
            }
        }
    }]
});
