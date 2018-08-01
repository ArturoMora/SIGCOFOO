(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("buscarplanNegocioDetail", ['AuthService', '$scope', 'planNegocioService', "$stateParams", "globalGet", "$rootScope", "MenuService", buscarplanNegocioDetail]);

    function buscarplanNegocioDetail(AuthService, $scope, planNegocioService, $stateParams, globalGet, $rootScope, MenuService) {
        window.scrollTo(0, 0)
        debugger;
        var id = $stateParams.id;
        if (id == undefined || id == null || id=='') {
            id = $rootScope.getGlobalID();
        }
        $scope.registro = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.rolId = MenuService.getRolId();
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        //Extraer informacion del usuario//
        $scope.descarga;
        //obtener el registro a mostrar
        debugger;
        planNegocioService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }

                if ($scope.rolId == 1028 || $scope.rolId == 1029) {
                    debugger;
                    $scope.descarga = true;
                } else {
                    planNegocioService.getDetailsAcceso(id, $scope.ClavePersonaLogin).then(
                    function (result) {
                        if (result.data == true) {
                            $scope.descarga = result.data;
                        }
                        //else {
                        //    planNegocioService.altosmandos($scope.rolId).then(
                        //        function (result) {
                        //            $scope.descarga = result.data;
                        //         });
                        //}
                    });
                }

            },
            function (error) {
                toastr.error(error);
            });
    }
})();