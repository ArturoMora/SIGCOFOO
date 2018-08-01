(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("distincionDetailCtrl"
        , ['AuthService'
        , '$scope'
        , 'DistincionService'
        , 'globalGet'
        , 'FileUploader'
        , '$state'
        , '$filter'
        ,'$stateParams'
        , distincionDetailCtrl]);
    function distincionDetailCtrl(AuthService, $scope, DistincionService, globalGet, FileUploader, $state, $filter, $stateParams) {
        //Variable API
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
       //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //Parametros
        $scope.distincion = {};
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        //Obtene distincion
        DistincionService.getbyid(id).then(
            function (result) {
                DistincionService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.distincion.nombreCompleto = result.data.nombreCompleto;
                });
                $scope.distincion = result.data;
                if ($scope.distincion.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                $scope.distincion.fechaDistincion = new Date(result.data.fechaDistincion);
            },
            function (err) {
                console.error(err);
            });

    }
})();