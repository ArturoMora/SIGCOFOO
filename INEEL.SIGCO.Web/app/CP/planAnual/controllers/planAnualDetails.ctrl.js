(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("PlanAnualDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$rootScope",
            "$stateParams",
            "PlanesAnualesCPService",
            "AutoresCPService",
            "DTOptionsBuilder",
            PlanAnualDetailsCtrl
        ]);

    function PlanAnualDetailsCtrl(AuthService, $scope, $state,$rootScope, $stateParams, PlanesAnualesCPService, AutoresCPService, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        $scope.registroId = $stateParams.id;
        PlanesAnualesCPService.getById($scope.registroId).then(
            function (result) {
                $scope.plan = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
                console.log(err);
            });

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 5, 'ContenidoId': $scope.registroId };
        AutoresCPService.getByContenido(busqueda).then(
            function (result) {
                $scope.autores = result.data;
            }, function (error) {
                toastr.error("No se han podido cargar los registros de autores");
                console.log(error);
            });

        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }

})();