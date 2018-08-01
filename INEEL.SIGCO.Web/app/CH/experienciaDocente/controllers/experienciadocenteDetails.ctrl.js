(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("experienciadocenteCtrlDetails", ['AuthService', '$scope', 'ExperienciaDocenteService', "$stateParams","globalGet", experienciadocenteCtrlDetails]);

    function experienciadocenteCtrlDetails(AuthService, $scope, ExperienciaDocenteService, $stateParams, globalGet) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        window.scrollTo(0, 0);
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        ExperienciaDocenteService.getbyid(id).then(
            function (result) {
                ExperienciaDocenteService.Persona(result.data.clavePersona).then(
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