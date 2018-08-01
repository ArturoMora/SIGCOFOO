(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("TipoSoftwareEditCtrl", ['AuthService', '$scope', 'TipoSoftwareService', 'globalGet', '$state', '$stateParams', 'comunService', TipoSoftwareEditCtrl]);
    function TipoSoftwareEditCtrl(AuthService, $scope, TipoSoftwareService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        TipoSoftwareService.getById(id).then(
            function (result) {
                $scope.software = result.data;
                $scope.excepcion = $scope.software.nombre;
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.software.nombre, "origen": "MT.tiposoftware", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.software.fechaEfectiva = new Date();
                        TipoSoftwareService.Update($scope.software).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("TipoSoftwareGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });
            }
        }
    }
})();