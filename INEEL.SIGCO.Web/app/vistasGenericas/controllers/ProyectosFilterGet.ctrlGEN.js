
(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("ProyectosFilterGetCtrl", [
        "$scope",
        "buscarProyectosService",
        "$uibModalInstance", ProyectosFilterGetCtrl]);

    function ProyectosFilterGetCtrl($scope, buscarProyectosService, $uibModalInstance) {
        $scope.click = false;
        $scope.nueva = false;
        $scope.proyectoInput = {};
        $scope.proyecto = {};
        $scope.proyectos = [];
        $scope.proyectoSelect = {};


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        $scope.buscar = function (proyectoInput) {
            $scope.click = true;
            debugger;
            buscarProyectosService.GetProyectos(proyectoInput).then(
                    function (result) {
                        $scope.proyectos = result.data;
                        debugger;
                        $scope.click = false;
                        if ($scope.proyectos.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }

                    },
                    function (err) {
                        $scope.proyectos = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        debugger;
                        $scope.click = false;
                    }
                )
        }

        $scope.ok = function () {
            $scope.proyecto = $scope.proyectoSelect.emp;
            toastr.clear();
            $uibModalInstance.close($scope.proyecto);

        }

    }
})();