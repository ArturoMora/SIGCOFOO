(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("capituloInfoCtrlDetails", ['AuthService', '$scope', '$rootScope', 'CapituloService', "$stateParams", "globalGet", capituloInfoCtrlDetails]);

    function capituloInfoCtrlDetails(AuthService, $scope,$rootScope, CapituloService, $stateParams, globalGet) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //var id = $stateParams.id;
        var id = $rootScope.getGlobalID();

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        CapituloService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                CapituloService.getPais($scope.registro.pais).then(
                function (result) {
                    $scope.pais = result.data;
                },
                function (error) {
                    toastr.error("Error al traer el país");
                });
                debugger;
            },
            function (error) {
                toastr.error(error);
            });
    }
})();