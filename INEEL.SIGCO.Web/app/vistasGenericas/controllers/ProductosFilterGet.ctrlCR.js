/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ProductosFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarProductosService",
        "$uibModalInstance",
        "MenuService",
        "DTOptionsBuilder", ProductosFilterGetCtrl]);

    function ProductosFilterGetCtrl($scope, $state, $stateParams,
        productosService, $uibModalInstance,MenuService, DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
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
            
            // $scope.competidor.adjuntosParam = null;
            // if ($scope.adjuntosParam.length > 0) {
            //     $scope.competidor.adjuntosParam = $scope.adjuntosParam;
            // }
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

        $scope.buscar = function (producto) {
            $scope.click = true;
           
            productosService.GetProductos(producto).then(
                    function (result) {
                        $scope.productos = result.data;
                        $scope.click = false;
                        if ($scope.productos.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.productos = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        $scope.click = false;
                    }
                )
            
        }

        $scope.ok = function () {
            $scope.producto = $scope.productoSelect.emp;
            $uibModalInstance.close($scope.producto);
        }

    }


})();