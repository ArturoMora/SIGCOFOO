(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("PaisCtrlEdit", ['AuthService', '$scope', 'PaisService', 'globalGet', '$state', '$stateParams','comunService', PaisCtrlEdit]);
    function PaisCtrlEdit(AuthService, $scope, PaisService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        PaisService.getById(id).then(
            function (result) {
                $scope.pais = result.data;
                $scope.excepcion = $scope.pais.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.pais.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.pais.descripcion.replace(/\n/g, "");
                $scope.pais.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "pais", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.desactivar = true;
                        PaisService.Update($scope.pais).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.PaisGet");
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