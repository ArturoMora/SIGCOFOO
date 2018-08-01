(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("InformeBecarioInternoDetailsCtrl", ['AuthService', '$scope', 'BecarioInternoService', "$stateParams", "globalGet", InformeBecarioInternoDetailsCtrl]);

    function InformeBecarioInternoDetailsCtrl(AuthService, $scope, BecarioInternoService, $stateParams, globalGet) {
        var id = $stateParams.id;
        window.scrollTo(0, 0)
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.claveEmpleado = AuthService.authentication.userprofile.clavePersona;


        //obtener el registro a mostrar
        BecarioInternoService.getbyid(id).then(
            function (result) {
                //BecarioInternoService.Persona(result.data.clavePersona).then(
                //    function (result) {
                //        $scope.registro.nombreCompleto = result.data.nombreCompleto;
                //    });
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