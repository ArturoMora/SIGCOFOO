(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("TipoCursoAddCtrl", ['AuthService', '$scope', 'TipoCursoService', 'globalGet', '$state', 'comunService', TipoCursoAddCtrl]);
    function TipoCursoAddCtrl(AuthService, $scope, TipoCursoService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        
        //Agregar Curso
        $scope.save = function () {
            if ($scope.ValidaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.curso.nombre, "origen": "MT.tipocurso" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var Registro = {
                            "Nombre": $scope.curso.nombre,
                            "Descripcion": $scope.curso.descripcion,
                            "FechaRegistro": new Date(),
                            "FechaEfectiva": new Date(),
                            "Estado": true
                        };
                        TipoCursoService.Add(Registro).then(
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