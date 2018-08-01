
(function () {
    "use strict";
    angular
        .module("ineelGEN")
        .controller("ProyectosFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarProyectosPorSubprogramaService",
        "$uibModalInstance",
        "DTOptionsBuilder", ProyectosFilterGetCtrl]);

    function ProyectosFilterGetCtrl($scope, $state, $stateParams,
        buscarProyectosPorSubprogramaService, $uibModalInstance,
        DTOptionsBuilder) {
            $scope.click = false;
            $scope.nueva = false;
        $scope.proyectoInput = {};
        $scope.proyecto = {};
        $scope.proyectos = [];
        $scope.proyectoSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()      
        .withOption('language', { sSearch: "Filtrar" })       
        .withOption('responsive', true);
       

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (proyectoInput) {
            $scope.click = true;
            
            buscarProyectosPorSubprogramaService.GetProyectos(proyectoInput).then(
                    function (result) {
                        $scope.proyectos = result.data;
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
                        $scope.click = false;
                    }
                )
        }

        $scope.ok = function () {
            $scope.proyecto = $scope.proyectoSelect.emp;
            $uibModalInstance.close($scope.proyecto);
        }

    }
})();