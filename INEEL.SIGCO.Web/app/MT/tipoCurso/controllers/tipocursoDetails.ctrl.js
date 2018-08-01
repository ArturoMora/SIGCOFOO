(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("TipoCursoDetailsCtrl", ["AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "TipoCursoService", 
        TipoCursoDetailsCtrl
        ]);

    function TipoCursoDetailsCtrl(AuthService,$scope, $state, $stateParams, TipoCursoService) {
        $scope.curso_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        TipoCursoService.getById($scope.curso_id).then(
            function (result) {
                $scope.curso = result.data;
                    if ($scope.curso.estado == true) {
                        $scope.curso.estado = "Activo";
                    } else if ($scope.curso.estado == false) {
                        $scope.curso.estado = "Inactivo";
                    }
            },
            function (err) {
                console.error(err);
            });
        }
})();