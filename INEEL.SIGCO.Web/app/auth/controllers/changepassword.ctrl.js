(function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("changepasswordCtrl", ["$scope", "$state", "AuthService", "blockUI", "$timeout", '$uibModalInstance', changepasswordCtrl]);

    function changepasswordCtrl($scope, $state, AuthService, blockUI, $timeout, $uibModalInstance) {
        $scope.btnClick = true;
        $scope.actualizo = false;
        $scope.loginData = {
            userName: AuthService.authentication.userName,
            password: "",
            confirmPassword: ""
        };

        $scope.message = "";

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.change = function () {
            AuthService.changepassword($scope.loginData).then(
                function (response) {
                    $scope.mensaje = response.data;
                    $scope.actualizo = true;;
                },
                function (err) {
                    $scope.message = err.data.message;
                    $scope.loginData.password = '';
                    $scope.loginData.confirmPassword ='';
                    $scope.repitpasswordnew = '';
                    $scope.actualizo = false;
                });

        };
    }
}());