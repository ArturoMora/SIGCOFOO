(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("daeinternoPatrimonialCtrlDetails", ['AuthService', '$scope', 'DAExternoService', "$stateParams", "globalGet", daeinternoPatrimonialCtrlDetails]);

    function daeinternoPatrimonialCtrlDetails(AuthService, $scope, DAExternoService, $stateParams, globalGet) {
        var id = $stateParams.id;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        DAExternoService.getbyidPatrimonial(id).then(
            function (result) {
                DAExternoService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                DAExternoService.getByDAIntPatrimonioColaboracion(result.data.solicitudesDAId).then(
                function (result) {
                    $scope.autoriie = result.data;
                });
               // DAExternoService.getByDAExternoExt(result.data.daExternoId).then(
               //function (result) {
               //    $scope.autorexterno = result.data;
               //});
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });
    }
})();