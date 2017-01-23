(function () {
    'use strict';

    angular
        .module('authAdminPanel')
        .controller('UsersEditController', UsersEditController);

    UsersEditController.$inject = ["Organization", "$state", "$scope", 'status', 'id'];

    function UsersEditController(Organization, $state, $scope, status, id) {
        var vm = this;
        vm.data = {};
        vm.status = status;
        vm.id = id;

        vm.save = function () {
            if (vm.status.edit && vm.id) {
                update();
            } else {
                create();
            }
        };

        vm.init = function () {
            Organization.get({ id: vm.id }).$promise
                .then(function (result) {
                    vm.data = result;
                }).catch(function (err) {
                    vm.error = err;
                    console.error(err);
                });
        };

        var create = function () {
            if ($scope.currentUser.organizationId >= 1)
                vm.data.parentOrganizationId = $scope.currentUser.organizationId;
            Organization
                .save(vm.data).$promise
                .then(function (result) {
                    $scope.currentUser.organizationId = result.id;
                    $scope.currentUser.organizationName = result.name;
                    $state.go('index.users');
                }).catch(function (err) {
                    vm.error = err;
                    console.error(err);
                });
        };

        var update = function () {
            Organization
                .update({ id: vm.id }, vm.data).$promise
                .then(function (result) {
                    $state.go('index.users');
                }).catch(function (err) {
                    vm.error = err;
                    console.error(err);
                });
        }

        if (vm.status.edit) {
            vm.init();
        };

        $scope.$on('$destroy', function () {
            vm.data = {};
        });
    };
})();