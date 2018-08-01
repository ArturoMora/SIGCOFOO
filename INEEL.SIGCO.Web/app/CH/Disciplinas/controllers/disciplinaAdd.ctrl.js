(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("DisciplinaCtrlAdd", ['AuthService', '$scope', 'DisciplinaService', 'globalGet', '$state','comunService', DisciplinaCtrlAdd]);
    function DisciplinaCtrlAdd(AuthService, $scope, DisciplinaService, globalGet, $state, comunService) {
        //Variable API
        $scope.loading = true;
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        //Obtener Campos
        DisciplinaService.GeCampos().then(
                function (campo) {
                    $scope.campos = campo.data;
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });
        

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.DisciplinaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.disciplina.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.disciplina.descripcion.replace(/\n/g, "");
                $scope.disciplina.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "disciplina" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.disciplina.fechaEfectiva = new Date();
                        $scope.disciplina.estado = 1;
                        $scope.desactivar = true;
                        DisciplinaService.Add($scope.disciplina).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.DisciplinaGet");
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