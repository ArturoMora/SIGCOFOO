(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("derechosautordetalleProyectoCtrl", [
            '$scope'
            , 'ComunServiceProyectos'
            , "$stateParams"
            , "globalGet"
            , "$rootScope"
            , "$state"
            , derechosautordetalleProyectoCtrl]);

    function derechosautordetalleProyectoCtrl($scope, ComunServiceProyectos, $stateParams, globalGet, $rootScope, $state) {
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        window.scrollTo(0, 0);

        $scope.volver = function () {
            $rootScope.globalRegresar();
        }

        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        ComunServiceProyectos.getdabyid(id).then(
            function (result) {
                
                $scope.derechoautor = result.data;
                if ($scope.derechoautor.adjuntoId == null) {
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