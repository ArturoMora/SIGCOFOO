(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("bitacoraSolicitudes", ['AuthService', '$scope', 'bitacoraSolicitudService', "$stateParams", "globalGet", bitacoraSolicitudes]);

    function bitacoraSolicitudes(AuthService, $scope, bitacoraSolicitudService, $stateParams, globalGet) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.idRegistro = id2;
        $scope.tipoInfo = id;
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        $scope.registros = [];
        bitacoraSolicitudService.getbyid(id, id2).then(
            function (result) {
                if (result.data != null) {
                    $scope.registros = result.data;
                    try {
                        $scope.registros.fechaMovimiento = new Date($scope.registros.fechaMovimiento);
                    } catch (e) { }
                }
            },
            function (error) {
                toastr.error(error);
            });
    }
})();