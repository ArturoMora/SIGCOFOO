(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("IdiomaCtrlEdit", ['AuthService', '$scope', 'IdiomaService', 'globalGet', '$state', '$stateParams', 'comunService', IdiomaCtrlEdit]);
    function IdiomaCtrlEdit(AuthService, $scope, IdiomaService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        IdiomaService.getById(id).then(
            function (result) {
                $scope.idioma = result.data;
                $scope.excepcion = $scope.idioma.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.idioma.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.idioma.descripcion.replace(/\n/g, "");
                $scope.idioma.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "idiomas", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.desactivar = true;
                        IdiomaService.Update($scope.idioma).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.IdiomaGet");
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