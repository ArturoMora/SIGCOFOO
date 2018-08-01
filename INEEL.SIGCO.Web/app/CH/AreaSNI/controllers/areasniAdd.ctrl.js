(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("AreaSNICtrlAdd", ['AuthService', '$scope', 'AreaSNIService', 'globalGet', '$state','comunService', AreaSNICtrlAdd]);
    function AreaSNICtrlAdd(AuthService, $scope, AreaSNIService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.AreaSNIForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.area.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.area.descripcion.replace(/\n/g, "");
                $scope.area.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "areasni" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.area.fechaEfectiva = new Date();
                        $scope.area.estado = 1;
                        $scope.desactivar = true;
                        AreaSNIService.Add($scope.area).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.AreaSNIGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                            $scope.desactivar = false;
                                        });
                    }
                });
            }
        }
    }
})();