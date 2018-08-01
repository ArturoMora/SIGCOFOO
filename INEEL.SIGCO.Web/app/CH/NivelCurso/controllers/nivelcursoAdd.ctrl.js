(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("NivelCursoCtrlAdd", ['AuthService', '$scope', 'NivelCursoService', 'globalGet', '$state','comunService', NivelCursoCtrlAdd]);
    function NivelCursoCtrlAdd(AuthService, $scope, NivelCursoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.curso.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.curso.descripcion.replace(/\n/g, "");
                $scope.curso.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "nivelcurso" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.curso.fechaEfectiva = new Date();
                        $scope.curso.estado = 1;
                        $scope.desactivar = true;
                        NivelCursoService.Add($scope.curso).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.NivelCursoGet");
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