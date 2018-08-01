(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("publicacionCtrlDetails", ['AuthService', '$scope', 'PublicacionService', "$stateParams","globalGet","$rootScope","$state", publicacionCtrlDetails]);

    function publicacionCtrlDetails(AuthService, $scope, PublicacionService, $stateParams, globalGet, $rootScope, $state) {
        var API = globalGet.get("api");
        window.scrollTo(0, 0);
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;

        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.publicacion", { seccion: 'publicacion' });
            }else{
                $rootScope.globalRegresar();
            }
        }


        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        PublicacionService.getbyid(id).then(
            function (result) {
                PublicacionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                PublicacionService.getByPublicacion(result.data.publicacionId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                PublicacionService.getByPublicacionExt(result.data.publicacionId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
            },
            function (error) {
                toastr.error(error);
            });
    }
})();