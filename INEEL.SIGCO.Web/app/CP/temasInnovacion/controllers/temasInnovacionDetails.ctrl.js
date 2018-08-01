(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TemasInnovacionDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$rootScope",
            "$stateParams",
            "TemasInnovacionCPService",
            "AutoresCPService",
            "DTOptionsBuilder",
            TemasInnovacionDetailsCtrl
        ]);

    function TemasInnovacionDetailsCtrl(AuthService, $scope, $state,$rootScope, $stateParams, TemasInnovacionCPService, AutoresCPService, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        $scope.registroId = $stateParams.id;
        TemasInnovacionCPService.getById($scope.registroId).then(
            function (result) {
                $scope.temasInn = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
                console.log(err);
            });

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 6, 'ContenidoId': $scope.registroId };
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