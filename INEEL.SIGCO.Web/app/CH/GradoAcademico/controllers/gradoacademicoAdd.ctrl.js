(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("GradoAcademicoCtrlAdd", ['AuthService', '$scope', 'GradoAcademicoService', 'globalGet', '$state','comunService', GradoAcademicoCtrlAdd]);
    function GradoAcademicoCtrlAdd(AuthService, $scope, GradoAcademicoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.grado.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.grado.descripcion.replace(/\n/g, "");
                $scope.grado.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "gradoacademico" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.grado.fechaEfectiva = new Date();
                        $scope.grado.estado = 1;
                        $scope.desactivar = true;
                        GradoAcademicoService.Add($scope.grado).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.GradoAcademicoGet");
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