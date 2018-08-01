/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ServiciosFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarServiciosService",
        "$uibModalInstance",
        "MenuService",
        "DTOptionsBuilder", ServiciosFilterGetCtrl]);

    function ServiciosFilterGetCtrl($scope, $state, $stateParams,
        serviciosService, $uibModalInstance,MenuService, DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
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
            
            // $scope.competidor.adjuntosParam = null;
            // if ($scope.adjuntosParam.length > 0) {
            //     $scope.competidor.adjuntosParam = $scope.adjuntosParam;
            // }
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

        $scope.buscar = function (servicio) {
            $scope.click = true;
           
            serviciosService.GetServicios(servicio).then(
                    function (result) {
                        $scope.servicios = result.data;
                        $scope.click = false;
                        if ($scope.servicios.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.servicios = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        $scope.click = false;
                    }
                )
            
        }

        $scope.ok = function () {
            $scope.servicio = $scope.servicioSelect.emp;
            $uibModalInstance.close($scope.servicio);
        }

    }


})();