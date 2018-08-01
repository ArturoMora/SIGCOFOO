(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("EstadoPublicacionCtrlAdd", ['AuthService', '$scope', 'EstadoPublicacionService', 'globalGet', '$state','comunService', EstadoPublicacionCtrlAdd]);
    function EstadoPublicacionCtrlAdd(AuthService, $scope, EstadoPublicacionService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.publicacion.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.publicacion.descripcion.replace(/\n/g, "");
                $scope.publicacion.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "estadopublicacion" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.publicacion.fechaEfectiva = new Date();
                        $scope.publicacion.estado = 1;
                        $scope.desactivar = true;
                        EstadoPublicacionService.Add($scope.publicacion).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.EstadoPublicacionGet");
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