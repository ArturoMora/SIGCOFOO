(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("becariodirigidoCtrlDetail", ['AuthService', '$scope', 'BecarioDirigidoService', "$stateParams","globalGet","$rootScope","$state", becariodirigidoCtrlDetail]);

    function becariodirigidoCtrlDetail(AuthService, $scope, BecarioDirigidoService, $stateParams, globalGet, $rootScope, $state) {
        var API = globalGet.get("api");
        window.scrollTo(0, 0);
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;

        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.becariodirigido", { seccion: 'becariodirigido' });
            } else {
                $rootScope.globalRegresar();
            }
        }

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.registro = {};

        //obtener el registro a mostrar
        // BecarioDirigidoService.getbyid(id).then(//getBecario
        BecarioDirigidoService.getBecario(id).then(//
            function (result) {
                // BecarioDirigidoService.Persona(result.data.clavePersona).then(
                // function (result) {
                //     $scope.registro.nombreCompleto = result.data.nombreCompleto;
                // });
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
                console.log(error);
            });
    }
})();