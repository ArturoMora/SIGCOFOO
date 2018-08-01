(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("publicacionCtrlDetails", ['AuthService', '$scope', 'PublicacionService', "$stateParams", "globalGet", "$rootScope", "$state", "IndicadoresMTService", publicacionCtrlDetails]);

    function publicacionCtrlDetails(AuthService, $scope, PublicacionService, $stateParams, globalGet, $rootScope, $state, IndicadoresMTService) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;

        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('indexMT') >= 0) {
                $state.go("Publicaciones");
            } else {
                $rootScope.globalRegresar();
            }
        }

        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        alert('foo');
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
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
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


        $scope.registraAcceso = function () {

         

            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "ART"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();

    }
})();