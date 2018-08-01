(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("NivelPublicacionCtrlEdit", ['AuthService', '$scope', 'NivelPublicacionService', 'globalGet', '$state', '$stateParams','comunService', NivelPublicacionCtrlEdit]);
    function NivelPublicacionCtrlEdit(AuthService, $scope, NivelPublicacionService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        NivelPublicacionService.getById(id).then(
            function (result) {
                $scope.publicacion = result.data;
                $scope.excepcion = $scope.publicacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
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
                var sinEspacios = $scope.publicacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.publicacion.descripcion.replace(/\n/g, "");
                $scope.publicacion.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "nivelpublicacion", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                $scope.desactivar = true;
                NivelPublicacionService.Update($scope.publicacion).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.NivelPublicacionGet");
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