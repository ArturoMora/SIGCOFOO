(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tesisdirigidaDetailsCtrl", ['AuthService', '$scope', 'TesisDirigidaService', "$stateParams","globalGet","$rootScope","$state", tesisdirigidaDetailsCtrl]);

    function tesisdirigidaDetailsCtrl(AuthService, $scope, TesisDirigidaService, $stateParams, globalGet, $rootScope, $state) {
        var id = $stateParams.id;
        window.scrollTo(0, 0)
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";

        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.tesisdirigida", { seccion: 'tesisdirigida' });
            } else {
                $rootScope.globalRegresar();
            }
        }


        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        TesisDirigidaService.getbyid(id).then(
            function (result) {
                TesisDirigidaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombreCompleto = result.data.nombreCompleto;
                });
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });
    }
})();