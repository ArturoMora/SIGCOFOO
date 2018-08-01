(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("sniDetailsCtrl", ['AuthService', '$scope', 'SNIService', "$stateParams","globalGet", sniDetailsCtrl]);

    function sniDetailsCtrl(AuthService, $scope, SNIService, $stateParams, globalGet) {
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        $scope.registrosni = {};
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        SNIService.getsnibyid(id).then(
            function (result) {
                SNIService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registrosni.nombreCompleto = result.data.nombreCompleto;
                });
                $scope.registrosni = result.data;
                if ($scope.registrosni.adjunto == null) {
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