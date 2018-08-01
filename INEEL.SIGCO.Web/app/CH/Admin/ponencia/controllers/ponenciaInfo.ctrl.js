(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("ponenciaInfoCtrlDetails", ['AuthService', '$scope', '$rootScope', 'PonenciaService', "$stateParams", "globalGet", ponenciaInfoCtrlDetails]);

    function ponenciaInfoCtrlDetails(AuthService, $scope, $rootScope, PonenciaService, $stateParams, globalGet) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //var id = $stateParams.id;
        var id = $rootScope.getGlobalID();

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        PonenciaService.getbyid(id).then(
            function (result) {
                PonenciaService.Persona(result.data.clavePersona).then(
                function (result) {
                    debugger;
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                PonenciaService.getByPonencia(result.data.ponenciaId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                PonenciaService.getByPonenciaExt(result.data.ponenciaId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
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