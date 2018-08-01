(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("AmbitoCtrlEdit", ['AuthService', '$scope', 'AmbitoService', 'globalGet', '$state', '$stateParams','comunService', AmbitoCtrlEdit]);
    function AmbitoCtrlEdit(AuthService, $scope, AmbitoService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        AmbitoService.getById(id).then(
            function (result) {
                $scope.ambito = result.data;
                $scope.excepcion = $scope.ambito.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.ambito.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.ambito.descripcion.replace(/\n/g, "");
                $scope.ambito.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "ambito", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.desactivar = true;
                        AmbitoService.Update($scope.ambito).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.AmbitoGet");
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