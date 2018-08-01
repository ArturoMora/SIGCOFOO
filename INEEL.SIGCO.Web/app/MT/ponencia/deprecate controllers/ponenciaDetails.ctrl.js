(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ponenciaCtrlDetails", ['AuthService', '$scope', 'PonenciaService', "$stateParams", "globalGet", "IndicadoresMTService", ponenciaCtrlDetails]);

    function ponenciaCtrlDetails(AuthService, $scope, PonenciaService, $stateParams, globalGet, IndicadoresMTService) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        $scope.autoriie = [];
        PonenciaService.getbyid(id).then(
            function (result) {
                PonenciaService.Persona(result.data.clavePersona).then(
                function (result) {
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
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
            },
            function (error) {
                toastr.error(error);
            });


        $scope.registraAcceso = function () {

          
            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "PONENCIA"
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