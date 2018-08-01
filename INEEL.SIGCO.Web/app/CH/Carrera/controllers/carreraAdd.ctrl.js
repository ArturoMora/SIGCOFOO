(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("CarreraCtrlAdd", ['AuthService', '$scope', 'CarreraService', 'globalGet', '$state','comunService', CarreraCtrlAdd]);
    function CarreraCtrlAdd(AuthService, $scope, CarreraService, globalGet, $state, comunService) {
        //Variable API
        $scope.loading = true;
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //ObtenerDisciplinas
        CarreraService.DisciplinasGet().then(
            function (result) {
                $scope.Disciplinas = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Disciplina");
            })

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.CarreraForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.carrera.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.carrera.descripcion.replace(/\n/g, "");
                $scope.carrera.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "carrera" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.carrera.fechaEfectiva = new Date();
                        $scope.carrera.estado = 1;
                        $scope.desactivar = true;
                        CarreraService.Add($scope.carrera).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.CarreraGet");
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