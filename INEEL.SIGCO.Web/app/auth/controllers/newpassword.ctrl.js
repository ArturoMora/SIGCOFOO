(function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("newpasswordCtrl", ["$scope", "$state", "$stateParams", "AuthService", "globalGet", "$http", newpassworCtrl]);

    function newpassworCtrl($scope, $state, $stateParams, AuthService, globalGet, $http) {

        if ($stateParams.id == null || $stateParams.id == '') {
            alert('No se ha podido obtener el codigo para recuperar contraseña');
            $state.go("login");
        }

        if ($stateParams.numemp == null || $stateParams.numemp == '') {
            alert('No se ha podido encontrar el número de empleado para estta solicitud.');
            $state.go("login");
        }

        $scope.codigo = $stateParams.id;
        $scope.numemp = $stateParams.numemp;
        var API = globalGet.get("api");

        $scope.validacodigo = function (validar) {
            var endPoint = API + "RecuperaPassword/ValidarCodigo";
            return $http.post(endPoint, validar);
        };

        $scope.validar = {};
        $scope.loginData = {};





        $scope.btnClick = true;
        $scope.actualizo = false;
        $scope.loginData = {
            userName: $scope.numemp,
            password: "",
            confirmPassword: ""
        };

        $scope.message = "";

        $scope.change = function () {
            $scope.validar.codigo = $scope.codigo;
            $scope.validar.clavepersona = $scope.numemp;
            $scope.validar.password = $scope.loginData.confirmPassword;
            $scope.validacodigo($scope.validar).then(
                function (response) {
                    $scope.actualizo = true;
                },
                function (err) {
                    $scope.message = err.data.message;
                    $scope.loginData.confirmPassword = '';
                    $scope.repitpasswordnew = '';
                    $scope.actualizo = false;
                }
            );

        };
    }
}());