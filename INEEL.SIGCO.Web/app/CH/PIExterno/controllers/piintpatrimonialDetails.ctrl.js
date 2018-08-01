(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("pieinternoPatrimonialCtrlDetails", ['AuthService', '$scope', 'PIExternoService', "$stateParams", "globalGet", pieinternoPatrimonialCtrlDetails]);

    function pieinternoPatrimonialCtrlDetails(AuthService, $scope, PIExternoService, $stateParams, globalGet) {
        var id = $stateParams.id;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        PIExternoService.getbyidColaboraciones(id).then(
            function (result) {
                PIExternoService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                PIExternoService.getByPIExterno2(result.data.requisicionesPIId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
                PIExternoService.getByPIExternoExt2(result.data.requisicionesPIId).then(
               function (result) {
                   $scope.autorexterno = result.data;
               });
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });
    }
})();