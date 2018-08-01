(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("capitulosCtrlDetails", ['AuthService', '$scope', 'CapituloService', "$stateParams", "globalGet",'$state','$rootScope', capitulosCtrlDetails]);

    function capitulosCtrlDetails(AuthService, $scope, CapituloService, $stateParams, globalGet, $state, $rootScope) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
            } else {
                $rootScope.globalRegresar();
            }
        }
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        CapituloService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                CapituloService.getPais($scope.registro.pais).then(
                function (result) {
                    $scope.pais=result.data;
                },
                function (error) {
                    toastr.error("Error al traer el país");
                });
                
            },
            function (error) {
                toastr.error(error);
            });
    }
})();