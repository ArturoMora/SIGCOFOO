(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("InformeAnualDetailsCtrl", [
            "AuthService",
            "$scope",
            "$rootScope",
            "$state",
            "$stateParams",
            "InformesAnualesCPService",
            "AutoresCPService",
            "DTOptionsBuilder",
            InformeAnualDetailsCtrl
        ]);

    function InformeAnualDetailsCtrl(AuthService, $scope,$rootScope, $state, $stateParams, InformesAnualesCPService, AutoresCPService, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        $scope.registroId = $stateParams.id;
        InformesAnualesCPService.getById($scope.registroId).then(
            function (result) {
                $scope.informes = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
                console.log(err);
            });

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 4, 'ContenidoId': $scope.registroId };
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