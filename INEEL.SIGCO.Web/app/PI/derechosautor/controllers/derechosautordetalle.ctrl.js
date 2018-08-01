(function () {
    "use strict";
    angular
        .module("ineelPI")
        .controller("dechoautordetalleCtrl", [
            '$scope'
            , 'DerechosAutorService'
            , "$stateParams"
            , "globalGet"
            , "$rootScope"
            , "$state"
            , dechoautordetalleCtrl]);

    function dechoautordetalleCtrl($scope, DerechosAutorService, $stateParams, globalGet, $rootScope, $state) {
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        window.scrollTo(0, 0);


        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
            } else {
                $rootScope.globalRegresar();
            }
        }




        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        DerechosAutorService.getdabyid(id).then(
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