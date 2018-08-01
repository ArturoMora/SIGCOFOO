(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("TipoCursoEditCtrl", ["AuthService", '$scope', 'TipoCursoService', 'globalGet', '$state', '$stateParams','comunService', TipoCursoEditCtrl]);
    function TipoCursoEditCtrl(AuthService, $scope, TipoCursoService, globalGet, $state, $stateParams,comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        TipoCursoService.getById(id).then(
            function (result) {
                $scope.curso = result.data;
                $scope.excepcion = $scope.curso.nombre;
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
                var registro = { "dato": $scope.curso.nombre, "origen": "MT.tipocurso", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.curso.fechaEfectiva = new Date();
                        //               TipoCursoService.Update(Registro).then(
                        TipoCursoService.Update($scope.curso).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("TipoCursoGet");
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