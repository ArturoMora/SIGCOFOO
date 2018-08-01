/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ProductosCompetidoresFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarProductosService",
        "$uibModalInstance",
        "MenuService",
        "DTOptionsBuilder", ProductosCompetidoresFilterGetCtrl]);

    function ProductosCompetidoresFilterGetCtrl($scope, $state, $stateParams,
        buscarProductosService, $uibModalInstance,MenuService, DTOptionsBuilder) {
        $scope.producto = {};
        $scope.vinculo = [];
        $scope.productos = [];
        $scope.productoSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        
        $scope.agregarProducto = function () {
            if ($scope.uoselecionada != null) {
                $scope.competidor.uoselecionada = $scope.uoselecionada;
            }
            MenuService.setVariable("datosCompetidor", true);
            MenuService.setVariable("competidor", $scope.competidor);

            $scope.competidor.producto = null;
            if ($scope.listaProductos!=null) {
                MenuService.setVariable("productos", $scope.listaProductos);
            }
            $scope.competidor.servicio = null;
            if ($scope.listaServicios!=null) {
                MenuService.setVariable("servicios", $scope.listaServicios);
            }
            
            $state.go("productoAdd");
        }

        buscarProductosService.GetProductosModalCompetidores().then(
            function (result) {
                $scope.productos = result.data;
        
                if ($scope.productos.length === 0) {
                    toastr.warning("Ning&uacute;n resultado");
                } 
            },
            function (err) {
                $scope.productos = [];
                toastr.error(err.data.message || "Error al procesar su solicitud");
                
            }
        );
        

        $scope.ok = function (producto) {
            $uibModalInstance.close(producto);
        }

    }


})();