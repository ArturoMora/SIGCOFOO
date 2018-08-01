/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ServiciosCompetidoresFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarServiciosService",
        "$uibModalInstance",
        "MenuService",
        "DTOptionsBuilder", ServiciosCompetidoresFilterGetCtrl]);

    function ServiciosCompetidoresFilterGetCtrl($scope, $state, $stateParams,
        serviciosService, $uibModalInstance,MenuService, DTOptionsBuilder) {
        $scope.servicio = {};
        $scope.vinculo = [];
        $scope.servicios = [];
        $scope.servicioSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.agregarServicio = function () {
            if ($scope.uoselecionada != null) {
                $scope.competidor.uoselecionada = $scope.uoselecionada;
            }
            MenuService.setVariable("datosCompetidor", true);
            MenuService.setVariable("competidor", $scope.competidor);

            $scope.competidor.servicio = null;
            if ($scope.listaServicios!=null) {
                MenuService.setVariable("servicios", $scope.listaServicios);
            }
            $scope.competidor.producto = null;
            if ($scope.listaProductos!=null) {
                MenuService.setVariable("productos", $scope.listaProductos);
            }
            $state.go("servicioAdd");

        }

        serviciosService.GetServiciosModalCompetidores().then(
            function (result) {
                $scope.servicios = result.data;
                
                if ($scope.servicios.length === 0) {
                    toastr.warning("Ning&uacute;n resultado");
                } 
            },
            function (err) {
                $scope.servicios = [];
                toastr.error(err.data.message || "Error al procesar su solicitud");
                
            }
        )
        

        $scope.ok = function (servicio) {
            $uibModalInstance.close(servicio);
        }

    }


})();