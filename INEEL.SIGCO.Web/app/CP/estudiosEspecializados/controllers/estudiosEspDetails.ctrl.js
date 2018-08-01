(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EstudiosEspecializadosDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$rootScope",
            "$stateParams",
            "EstudiosEspecializadosCPService",
            "AutoresCPService",
            "DTOptionsBuilder",
            EstudiosEspecializadosDetailsCtrl
        ]);

    function EstudiosEspecializadosDetailsCtrl(AuthService, $scope, $state,$rootScope, $stateParams, EstudiosEspecializadosCPService, AutoresCPService, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        $scope.registroId = $stateParams.id;
        EstudiosEspecializadosCPService.getById($scope.registroId).then(
            function (result) {
                $scope.estudios = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
                console.log(err);
            });

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 3, 'ContenidoId': $stateParams.id };
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