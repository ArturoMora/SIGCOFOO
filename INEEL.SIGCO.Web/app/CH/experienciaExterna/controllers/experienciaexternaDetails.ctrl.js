(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("experienciaexternaCtrlDetails", ['AuthService', '$scope', 'ExperienciaExternaService', "$stateParams", "globalGet", experienciaexternaCtrlDetails]);

    function experienciaexternaCtrlDetails(AuthService, $scope, ExperienciaExternaService, $stateParams, globalGet) {
        var id = $stateParams.id;
        window.scrollTo(0, 0);
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        ExperienciaExternaService.getbyid(id).then(
            function (result) {
                ExperienciaExternaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
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