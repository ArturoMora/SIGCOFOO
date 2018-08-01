(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("NivelPublicacionCtrlAdd", ['AuthService', '$scope', 'NivelPublicacionService', 'globalGet', '$state','comunService', NivelPublicacionCtrlAdd]);
    function NivelPublicacionCtrlAdd(AuthService, $scope, NivelPublicacionService, globalGet, $state, comunService) {
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
                var registro = { "dato": sinEspacios, "origen": "nivelpublicacion" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.publicacion.fechaEfectiva = new Date();
                        $scope.publicacion.estado = 1;
                        NivelPublicacionService.Add($scope.publicacion).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.NivelPublicacionGet");
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