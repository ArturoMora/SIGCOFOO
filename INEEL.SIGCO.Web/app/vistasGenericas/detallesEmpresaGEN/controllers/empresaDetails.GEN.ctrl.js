(function () {
    "use strict";

    angular
        .module("ineel.services")
        .controller("EmpresaDetailsGENCtrl", [
            "AuthService",
            "$filter",
            "$scope",
            "$state",
            "$uibModalInstance",
            "ComunServiceEmpresas",
            EmpresaDetailsGENCtrl
        ]);

    function EmpresaDetailsGENCtrl(AuthService, $filter, $scope, $state, $uibModalInstance, ComunServiceEmpresas) {

        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};

        ComunServiceEmpresas.GetEmpresaWithImagen($scope.idempresa).then(
            function (result) {
                $scope.empresa = result.data;
                //console.log($scope.empresa);
            },
            function (err) {
                console.log(err);
            });

        ComunServiceEmpresas.CountProyectosHistoricos($scope.idempresa).then(
            function (result) {
                $scope.proyectosHistoricos = result.data;
            },
            function (err) {
                console.log(err);
            });

        ComunServiceEmpresas.CountProyectosVigentes($scope.idempresa).then(
            function (result) {
                $scope.proyectosVigentes = result.data;
            },
            function (err) {
                console.log(err);
            });

        ComunServiceEmpresas.CountConveniosEmpresa($scope.idempresa).then(
            function (result) {
                $scope.convenios = result.data;
            },
            function (err) {
                console.log(err);
            });

        ComunServiceEmpresas.CountFondosByEmpresa($scope.idempresa).then(
            function (result) {
                $scope.fondos = result.data;
            },
            function (err) {
                console.log(err);
            });

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }
})();