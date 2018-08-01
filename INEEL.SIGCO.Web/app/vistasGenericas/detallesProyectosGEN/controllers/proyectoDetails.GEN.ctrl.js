(function () {
    "use strict";

    angular
    .module("ineel.services")
    .controller("ProyectoDetailsGENCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModalInstance",
        "ComunServiceProyectos",
        ProyectoDetailsGENCtrl
    ]);

    function ProyectoDetailsGENCtrl(AuthService, $filter, $scope, $state, $uibModalInstance,  ComunServiceProyectos) {

        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};

        var proyectoId = $scope.proyectoId;

        $scope.proyectoAsginadoDetails = {};

        ComunServiceProyectos.GetDatosProyectoForModal($scope.idproyecto).then(
        function (result) {
            $scope.proyecto = result.data;
            $scope.foo = "datos desde el controlador";
        },
        function (err) {
            console.log(err);
        });

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }
})();