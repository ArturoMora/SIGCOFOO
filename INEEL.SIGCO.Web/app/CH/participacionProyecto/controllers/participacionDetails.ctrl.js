(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("participacionCtrlDetails", ['AuthService', '$scope', 'ParticipacionService', "$stateParams","globalGet", participacionCtrlDetails]);

    function participacionCtrlDetails(AuthService, $scope, ParticipacionService, $stateParams, globalGet) {
        var id = $stateParams.id;
        window.scrollTo(0, 0);
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        ParticipacionService.getbyid(id).then(
            function (result) {
                ParticipacionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
                $scope.registro = result.data;
                //obtener el año, si es 1900 se considerará como NULL y no se mostrará la etiqueta
                var anioParticipacionA = new Date($scope.registro.fechaInicio)
                $scope.anioParticipacion = anioParticipacionA.getFullYear();

                
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