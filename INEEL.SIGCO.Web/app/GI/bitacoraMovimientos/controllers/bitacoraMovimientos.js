(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("bitacoraMovimientos", ['AuthService', '$scope', 'bitacoraMovimientoService', "$stateParams", "globalGet","$rootScope", bitacoraMovimientos]);

    function bitacoraMovimientos(AuthService, $scope, bitacoraMovimientoService, $stateParams, globalGet, $rootScope) {
        var API = globalGet.get("api");
        
        var id = $stateParams.id;
        if (id === undefined || id == null || id == "") {
            id = $rootScope.getGlobalID();
        }

        var id2 = $stateParams.id2;
        if (id2 === undefined || id2 == null || id2 == "") {
            id2 = $rootScope.getGlobalID2();
        }
        $scope.OcsId =id2;
        $scope.authentication = AuthService.authentication;
        $scope.registros = [];
        bitacoraMovimientoService.GetAllByRegistroId(id, $scope.OcsId).then(
            function (result) {
                if (result.data != null) {
                    $scope.registros = result.data;
                    //try {
                    //    $scope.registros.fechaMovimiento = new Date($scope.registros.fechaMovimiento);
                    //} catch (e) { }
                }
            },
            function (error) {
                toastr.error(error);
            });
    }
})();