(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("asociacionDetailsCtrl", ['AuthService', '$scope', 'AsociacionesService', "$stateParams","globalGet", asociacionDetailsCtrl]);

    function asociacionDetailsCtrl(AuthService, $scope, AsociacionesService, $stateParams, globalGet) {
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        $scope.asociacion = {};

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        AsociacionesService.GetById(id).then(
            function (result) {
                AsociacionesService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.asociacion.nombreCompleto = result.data.nombreCompleto;
                });
                $scope.asociacion = result.data;
                if ($scope.asociacion.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                $scope.asociacion.fechaInicio = new Date($scope.asociacion.fechaInicio);
                $scope.asociacion.fechaTermino = new Date($scope.asociacion.fechaTermino);
                if($scope.asociacion.fechaValidacion!=null){
                $scope.asociacion.fechaValidacion = new Date($scope.asociacion.fechaValidacion);
                }
            },
            function (error) {
                toastr.error(error);
            });
    }
})();