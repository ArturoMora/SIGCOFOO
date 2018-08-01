(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("AreaSNICtrlEdit", ['AuthService', '$scope', '$http', 'AreaSNIService', 'globalGet', '$state', '$filter', 'DTOptionsBuilder', '$stateParams','comunService', AreaSNICtrlEdit]);
    function AreaSNICtrlEdit(AuthService, $scope, $http, AreaSNIService, globalGet, $state, $filter, DTOptionsBuilder, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;
        //Obtene area
        AreaSNIService.getById(id).then(
            function (result) {
                $scope.area = result.data;
                $scope.area.fechaEfectiva = new Date(result.data.fechaEfectiva);
                $scope.excepcion = $scope.area.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.AreaSNIForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.area.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.area.descripcion.replace(/\n/g, "");
                $scope.area.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "areasni", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                AreaSNIService.Update($scope.area).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.AreaSNIGet");
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                    }
                });
            }
        }
    }
})();